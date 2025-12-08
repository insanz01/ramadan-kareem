import { useState, useEffect, useCallback, useRef } from 'react'
import { calculateQiblaDirection } from '../utils/helpers'

// Low-pass filter for smoothing compass readings
const smoothHeading = (newHeading, prevHeading, smoothingFactor = 0.15) => {
    if (prevHeading === null) return newHeading

    // Handle the wrap-around at 0/360 degrees
    let diff = newHeading - prevHeading
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360

    let smoothed = prevHeading + diff * smoothingFactor
    // Normalize to 0-360
    smoothed = (smoothed + 360) % 360

    return smoothed
}

export function useQibla(latitude, longitude) {
    const [qiblaDirection, setQiblaDirection] = useState(null)
    const [compassHeading, setCompassHeading] = useState(0)
    const [isSupported, setIsSupported] = useState(false)
    const [permissionGranted, setPermissionGranted] = useState(false)
    const [error, setError] = useState(null)
    const [accuracy, setAccuracy] = useState(null) // Track sensor accuracy

    const lastHeadingRef = useRef(null)
    const headingHistoryRef = useRef([])
    const absoluteOrientationSensor = useRef(null)

    // Calculate qibla direction from user's location
    useEffect(() => {
        if (latitude && longitude) {
            const direction = calculateQiblaDirection(latitude, longitude)
            setQiblaDirection(direction)
        }
    }, [latitude, longitude])

    // Check if device orientation is supported
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check for AbsoluteOrientationSensor (most accurate)
            if ('AbsoluteOrientationSensor' in window) {
                setIsSupported(true)
            } else if ('DeviceOrientationEvent' in window) {
                setIsSupported(true)
            }
        }
    }, [])

    // Handle device orientation with smoothing
    const handleOrientation = useCallback((event) => {
        let heading = null

        // For iOS - webkitCompassHeading is already magnetic north relative
        if (event.webkitCompassHeading !== undefined) {
            heading = event.webkitCompassHeading
            // iOS provides accuracy in degrees
            if (event.webkitCompassAccuracy !== undefined) {
                setAccuracy(event.webkitCompassAccuracy)
            }
        }
        // For Android - check if we have absolute orientation
        else if (event.absolute === true && event.alpha !== null) {
            // When absolute is true, alpha is relative to magnetic north
            heading = (360 - event.alpha) % 360
        }
        // Fallback for Android without absolute orientation
        else if (event.alpha !== null) {
            // Alpha is the compass heading for Android
            heading = (360 - event.alpha) % 360
        }

        if (heading !== null) {
            // Apply smoothing filter
            const smoothedHeading = smoothHeading(heading, lastHeadingRef.current)
            lastHeadingRef.current = smoothedHeading

            // Keep history for additional smoothing (moving average)
            headingHistoryRef.current.push(smoothedHeading)
            if (headingHistoryRef.current.length > 5) {
                headingHistoryRef.current.shift()
            }

            // Calculate average of last 5 readings
            const avgHeading = headingHistoryRef.current.reduce((a, b) => a + b, 0) / headingHistoryRef.current.length

            setCompassHeading(avgHeading)
        }
    }, [])

    // Try to use AbsoluteOrientationSensor for best accuracy (Chrome on Android)
    const setupAbsoluteOrientationSensor = useCallback(() => {
        if ('AbsoluteOrientationSensor' in window) {
            try {
                const sensor = new window.AbsoluteOrientationSensor({ frequency: 30 })

                sensor.addEventListener('reading', () => {
                    // Convert quaternion to euler angles
                    const q = sensor.quaternion
                    const heading = Math.atan2(
                        2 * (q[0] * q[1] + q[2] * q[3]),
                        1 - 2 * (q[1] * q[1] + q[2] * q[2])
                    ) * (180 / Math.PI)

                    const normalizedHeading = (heading + 360) % 360

                    // Apply smoothing
                    const smoothedHeading = smoothHeading(normalizedHeading, lastHeadingRef.current)
                    lastHeadingRef.current = smoothedHeading
                    setCompassHeading(smoothedHeading)
                })

                sensor.addEventListener('error', (e) => {
                    console.log('AbsoluteOrientationSensor error, falling back to DeviceOrientation')
                    // Fall back to DeviceOrientationEvent
                    window.addEventListener('deviceorientationabsolute', handleOrientation, true)
                    window.addEventListener('deviceorientation', handleOrientation, true)
                })

                sensor.start()
                absoluteOrientationSensor.current = sensor
                return true
            } catch (e) {
                return false
            }
        }
        return false
    }, [handleOrientation])

    // Request permission for device orientation (required for iOS 13+)
    const requestPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await DeviceOrientationEvent.requestPermission()
                if (response === 'granted') {
                    setPermissionGranted(true)
                    window.addEventListener('deviceorientation', handleOrientation, true)
                } else {
                    setError('Izin sensor orientasi ditolak')
                }
            } catch (err) {
                setError('Error saat meminta izin sensor')
            }
        } else {
            // For non-iOS devices
            setPermissionGranted(true)

            // Try AbsoluteOrientationSensor first (most accurate)
            const sensorStarted = setupAbsoluteOrientationSensor()

            if (!sensorStarted) {
                // Fall back to DeviceOrientationEvent
                // Try deviceorientationabsolute first (Android absolute compass)
                if ('ondeviceorientationabsolute' in window) {
                    window.addEventListener('deviceorientationabsolute', handleOrientation, true)
                } else {
                    window.addEventListener('deviceorientation', handleOrientation, true)
                }
            }
        }
    }

    // Cleanup
    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation, true)
            window.removeEventListener('deviceorientationabsolute', handleOrientation, true)
            if (absoluteOrientationSensor.current) {
                absoluteOrientationSensor.current.stop()
            }
        }
    }, [handleOrientation])

    // Calculate the rotation needed to point to Qibla
    const getQiblaRotation = () => {
        if (qiblaDirection === null) return 0
        return (qiblaDirection - compassHeading + 360) % 360
    }

    return {
        qiblaDirection,
        compassHeading,
        qiblaRotation: getQiblaRotation(),
        isSupported,
        permissionGranted,
        requestPermission,
        error,
        accuracy // Return accuracy so UI can show calibration status
    }
}

