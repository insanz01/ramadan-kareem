import { useState, useEffect } from 'react'

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [isInstallable, setIsInstallable] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        // Check if already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true

        if (isStandalone) {
            setIsInstalled(true)
            return
        }

        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
        setIsIOS(isIOSDevice)

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()
            // Store the event for later use
            setDeferredPrompt(e)
            setIsInstallable(true)
        }

        // Listen for app installed event
        const handleAppInstalled = () => {
            setDeferredPrompt(null)
            setIsInstallable(false)
            setIsInstalled(true)
            console.log('PWA was installed')
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const promptInstall = async () => {
        if (!deferredPrompt) {
            return false
        }

        // Show the install prompt
        deferredPrompt.prompt()

        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice

        // Clear the deferred prompt
        setDeferredPrompt(null)
        setIsInstallable(false)

        return outcome === 'accepted'
    }

    return {
        isInstallable,
        isInstalled,
        isIOS,
        promptInstall
    }
}
