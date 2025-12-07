// Custom Service Worker for Prayer Time Notifications

let prayerTimes = null
let notificationSettings = null
let lastNotified = {}

// Listen for messages from the main app
self.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_PRAYER_TIMES') {
        prayerTimes = event.data.prayerTimes
        notificationSettings = event.data.settings

        // Schedule notification checks
        scheduleNotificationCheck()
    }
})

// Check prayer times and show notifications
function checkAndNotify() {
    if (!prayerTimes || !notificationSettings || !notificationSettings.enabled) {
        return
    }

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const prayerKeys = ['Imsak', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
    const prayerNames = {
        Imsak: { name: 'Imsak', message: 'Waktu imsak telah tiba. Segera akhiri sahur.' },
        Fajr: { name: 'Subuh', message: 'Waktu Subuh telah tiba. Mari menunaikan sholat.' },
        Sunrise: { name: 'Terbit', message: 'Matahari telah terbit.' },
        Dhuhr: { name: 'Dzuhur', message: 'Waktu Dzuhur telah tiba. Mari menunaikan sholat.' },
        Asr: { name: 'Ashar', message: 'Waktu Ashar telah tiba. Mari menunaikan sholat.' },
        Maghrib: { name: 'Maghrib', message: 'Waktu Maghrib telah tiba. Saatnya berbuka puasa.' },
        Isha: { name: 'Isya', message: 'Waktu Isya telah tiba. Mari menunaikan sholat.' }
    }

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
        if (!notificationSettings.prayers[key]) return

        const timeStr = timingsMap[key]
        if (!timeStr) return

        const [hours, minutes] = timeStr.split(':').map(Number)
        const prayerMinutes = hours * 60 + minutes

        const todayKey = `${now.toDateString()}-${key}`
        const reminderKey = `${todayKey}-reminder`

        // Check for reminder
        if (notificationSettings.reminderMinutes > 0) {
            const reminderMinutes = prayerMinutes - notificationSettings.reminderMinutes
            if (currentTime === reminderMinutes && !lastNotified[reminderKey]) {
                self.registration.showNotification(
                    `⏰ ${notificationSettings.reminderMinutes} Menit Menuju ${prayerNames[key].name}`,
                    {
                        body: `Persiapkan diri untuk sholat ${prayerNames[key].name}`,
                        icon: '/logo-192.png',
                        badge: '/logo-192.png',
                        tag: reminderKey,
                        vibrate: [200, 100, 200],
                        requireInteraction: true,
                        data: { type: 'reminder', prayer: key }
                    }
                )
                lastNotified[reminderKey] = true
            }
        }

        // Check for exact prayer time
        if (currentTime === prayerMinutes && !lastNotified[todayKey]) {
            self.registration.showNotification(
                `🕌 ${prayerNames[key].name}`,
                {
                    body: prayerNames[key].message,
                    icon: '/logo-192.png',
                    badge: '/logo-192.png',
                    tag: todayKey,
                    vibrate: [200, 100, 200, 100, 200],
                    requireInteraction: true,
                    data: { type: 'prayer', prayer: key }
                }
            )
            lastNotified[todayKey] = true
        }
    })

    // Clear old entries
    const today = now.toDateString()
    Object.keys(lastNotified).forEach(key => {
        if (!key.includes(today)) {
            delete lastNotified[key]
        }
    })
}

// Schedule periodic checks
let checkInterval = null

function scheduleNotificationCheck() {
    // Clear existing interval
    if (checkInterval) {
        clearInterval(checkInterval)
    }

    // Check every minute
    checkInterval = setInterval(checkAndNotify, 60000)

    // Also check immediately
    checkAndNotify()
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    // Focus or open the app
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // If app is already open, focus it
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus()
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow('/')
            }
        })
    )
})

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event.notification.tag)
})
