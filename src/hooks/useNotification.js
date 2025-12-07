import { useState, useEffect, useCallback } from 'react'

export function useNotification() {
    const [permission, setPermission] = useState('default')
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        // Check if notifications are supported
        if ('Notification' in window) {
            setIsSupported(true)
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = async () => {
        if (!isSupported) {
            return 'unsupported'
        }

        try {
            const result = await Notification.requestPermission()
            setPermission(result)
            return result
        } catch (error) {
            console.error('Error requesting notification permission:', error)
            return 'denied'
        }
    }

    const showNotification = useCallback((title, options = {}) => {
        if (!isSupported || permission !== 'granted') {
            console.log('Notifications not available or permission denied')
            return null
        }

        const defaultOptions = {
            icon: '/logo-192.png',
            badge: '/logo-192.png',
            vibrate: [200, 100, 200],
            requireInteraction: true,
            ...options
        }

        try {
            // Try to use service worker notification first (works in background)
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, defaultOptions)
                })
                return true
            } else {
                // Fallback to regular notification
                const notification = new Notification(title, defaultOptions)
                return notification
            }
        } catch (error) {
            console.error('Error showing notification:', error)
            return null
        }
    }, [isSupported, permission])

    return {
        isSupported,
        permission,
        requestPermission,
        showNotification
    }
}
