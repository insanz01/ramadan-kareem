import { useState, useEffect, useCallback } from 'react'
import { calculateQiblaDirection } from '../utils/helpers'

export function useQibla(latitude, longitude) {
    const [qiblaDirection, setQiblaDirection] = useState(null)
    const [compassHeading, setCompassHeading] = useState(0)
    const [isSupported, setIsSupported] = useState(false)
    const [permissionGranted, setPermissionGranted] = useState(false)
    const [error, setError] = useState(null)

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
            if ('DeviceOrientationEvent' in window) {
                setIsSupported(true)
            }
        }
    }, [])

    // Handle device orientation
    const handleOrientation = useCallback((event) => {
        let heading = null

        // For iOS
        if (event.webkitCompassHeading !== undefined) {
            heading = event.webkitCompassHeading
        }
        // For Android
        else if (event.alpha !== null) {
            // Alpha is the compass heading for Android
            // We need to convert it: 360 - alpha gives us the compass heading
            heading = 360 - event.alpha
        }

        if (heading !== null) {
            setCompassHeading(heading)
        }
    }, [])

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
            // For non-iOS devices or older iOS versions
            setPermissionGranted(true)
            window.addEventListener('deviceorientation', handleOrientation, true)
        }
    }

    // Cleanup
    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation, true)
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
        error
    }
}
