import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useNotification } from '../hooks/useNotification'
import { usePrayerTimes, getNextPrayer } from '../hooks/usePrayerTimes'
import { useLocation } from './LocationContext'

const NotificationContext = createContext()

// Prayer names in Indonesian
const PRAYER_NAMES = {
    Imsak: { name: 'Imsak', message: 'Waktu imsak telah tiba. Segera akhiri sahur.' },
    Fajr: { name: 'Subuh', message: 'Waktu Subuh telah tiba. Mari menunaikan sholat.' },
    Sunrise: { name: 'Terbit', message: 'Matahari telah terbit.' },
    Dhuhr: { name: 'Dzuhur', message: 'Waktu Dzuhur telah tiba. Mari menunaikan sholat.' },
    Asr: { name: 'Ashar', message: 'Waktu Ashar telah tiba. Mari menunaikan sholat.' },
    Maghrib: { name: 'Maghrib', message: 'Waktu Maghrib telah tiba. Saatnya berbuka puasa.' },
    Isha: { name: 'Isya', message: 'Waktu Isya telah tiba. Mari menunaikan sholat.' }
}

export function NotificationProvider({ children }) {
    const { location } = useLocation()
    const { prayerTimes } = usePrayerTimes(location?.latitude, location?.longitude)
    const { isSupported, permission, requestPermission, showNotification } = useNotification()

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('notification-settings')
        return saved ? JSON.parse(saved) : {
            enabled: false,
            reminderMinutes: 5,
            prayers: {
                Imsak: true,
                Fajr: true,
                Sunrise: false,
                Dhuhr: true,
                Asr: true,
                Maghrib: true,
                Isha: true
            },
            sound: false, // Will be implemented when adzan audio is provided
            soundVolume: 0.7
        }
    })

    const lastNotifiedRef = useRef({})
    const checkIntervalRef = useRef(null)

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('notification-settings', JSON.stringify(settings))
    }, [settings])

    // Register service worker for background notifications
    useEffect(() => {
        if ('serviceWorker' in navigator && settings.enabled && prayerTimes) {
            navigator.serviceWorker.ready.then(registration => {
                // Send prayer times to service worker
                if (registration.active) {
                    registration.active.postMessage({
                        type: 'UPDATE_PRAYER_TIMES',
                        prayerTimes: prayerTimes,
                        settings: settings
                    })
                }
            })
        }
    }, [prayerTimes, settings])

    // Check prayer times every minute
    const checkPrayerTimes = useCallback(() => {
        if (!settings.enabled || !prayerTimes || permission !== 'granted') {
            return
        }

        const now = new Date()
        const currentTime = now.getHours() * 60 + now.getMinutes()

        const prayerKeys = ['Imsak', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
        const timingsMap = {
            Imsak: prayerTimes.Imsak,
            Fajr: prayerTimes.Fajr,
            Sunrise: prayerTimes.Sunrise,
            Dhuhr: prayerTimes.Dhuhr,
            Asr: prayerTimes.Asr,
            Maghrib: prayerTimes.Maghrib,
            Isha: prayerTimes.Isha
        }

        prayerKeys.forEach(key => {
            if (!settings.prayers[key]) return

            const timeStr = timingsMap[key]
            if (!timeStr) return

            const [hours, minutes] = timeStr.split(':').map(Number)
            const prayerMinutes = hours * 60 + minutes

            const todayKey = `${now.toDateString()}-${key}`
            const reminderKey = `${todayKey}-reminder`

            // Check for reminder (X minutes before)
            if (settings.reminderMinutes > 0) {
                const reminderMinutes = prayerMinutes - settings.reminderMinutes
                if (currentTime === reminderMinutes && !lastNotifiedRef.current[reminderKey]) {
                    showNotification(
                        `⏰ ${settings.reminderMinutes} Menit Menuju ${PRAYER_NAMES[key].name}`,
                        {
                            body: `Persiapkan diri untuk sholat ${PRAYER_NAMES[key].name}`,
                            tag: reminderKey,
                            data: { type: 'reminder', prayer: key }
                        }
                    )
                    lastNotifiedRef.current[reminderKey] = true
                }
            }

            // Check for exact prayer time
            if (currentTime === prayerMinutes && !lastNotifiedRef.current[todayKey]) {
                showNotification(
                    `🕌 ${PRAYER_NAMES[key].name}`,
                    {
                        body: PRAYER_NAMES[key].message,
                        tag: todayKey,
                        data: { type: 'prayer', prayer: key }
                    }
                )
                lastNotifiedRef.current[todayKey] = true

                // Play adzan sound if enabled (placeholder for future implementation)
                if (settings.sound) {
                    playAdzanSound(key)
                }
            }
        })

        // Clear old notifications from ref (older than today)
        const today = now.toDateString()
        Object.keys(lastNotifiedRef.current).forEach(key => {
            if (!key.includes(today)) {
                delete lastNotifiedRef.current[key]
            }
        })
    }, [settings, prayerTimes, permission, showNotification])

    // Play adzan sound based on prayer time
    const playAdzanSound = (prayerKey) => {
        // Use different adzan for Subuh (Fajr) and other prayers
        const audioSrc = prayerKey === 'Fajr'
            ? '/sounds/adzan-subuh.mp3'
            : '/sounds/adzan.mp3'

        try {
            const audio = new Audio(audioSrc)
            audio.volume = settings.soundVolume
            audio.play().catch(err => {
                console.error('Error playing adzan:', err)
            })
        } catch (error) {
            console.error('Error creating audio:', error)
        }
    }

    // Start/stop checking prayer times
    useEffect(() => {
        if (settings.enabled && prayerTimes && permission === 'granted') {
            // Check immediately
            checkPrayerTimes()

            // Then check every minute
            checkIntervalRef.current = setInterval(checkPrayerTimes, 60000)
        }

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current)
            }
        }
    }, [settings.enabled, prayerTimes, permission, checkPrayerTimes])

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }))
    }

    const toggleNotifications = async () => {
        if (!settings.enabled) {
            // Enabling notifications
            if (permission !== 'granted') {
                const result = await requestPermission()
                if (result !== 'granted') {
                    return false
                }
            }
            updateSettings({ enabled: true })
            return true
        } else {
            // Disabling notifications
            updateSettings({ enabled: false })
            return true
        }
    }

    const togglePrayer = (prayerKey) => {
        setSettings(prev => ({
            ...prev,
            prayers: {
                ...prev.prayers,
                [prayerKey]: !prev.prayers[prayerKey]
            }
        }))
    }

    return (
        <NotificationContext.Provider
            value={{
                isSupported,
                permission,
                settings,
                updateSettings,
                toggleNotifications,
                togglePrayer,
                requestPermission
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotificationSettings() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotificationSettings must be used within a NotificationProvider')
    }
    return context
}
