// Utility untuk format waktu dan perhitungan
export function formatTime(date) {
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

export function formatDate(date) {
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export function formatDateShort(date) {
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
    })
}

// Hitung selisih waktu dalam format jam:menit:detik
export function getTimeDifference(targetTime) {
    const now = new Date()
    const target = new Date(targetTime)

    let diff = target - now

    if (diff < 0) {
        return { hours: 0, minutes: 0, seconds: 0, isNegative: true }
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    diff -= hours * (1000 * 60 * 60)

    const minutes = Math.floor(diff / (1000 * 60))
    diff -= minutes * (1000 * 60)

    const seconds = Math.floor(diff / 1000)

    return { hours, minutes, seconds, isNegative: false }
}

// Hitung jarak hari ke Ramadhan
export function getDaysToRamadhan(ramadhanStartDate) {
    const now = new Date()
    const start = new Date(ramadhanStartDate)

    const diff = start - now

    if (diff < 0) return 0

    return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Hitung hari ke-berapa Ramadhan
export function getRamadhanDay(ramadhanStartDate) {
    const now = new Date()
    const start = new Date(ramadhanStartDate)

    const diff = now - start

    if (diff < 0) return 0

    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

// Format countdown display
export function formatCountdown(diff) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
    }
}

// Parse waktu sholat dari API
export function parseTimeString(timeStr, date = new Date()) {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const result = new Date(date)
    result.setHours(hours, minutes, 0, 0)
    return result
}

// Cek apakah sekarang dalam waktu puasa (antara subuh dan maghrib)
export function isCurrentlyFasting(prayerTimes) {
    if (!prayerTimes) return false

    const now = new Date()
    const fajr = parseTimeString(prayerTimes.Fajr)
    const maghrib = parseTimeString(prayerTimes.Maghrib)

    return now >= fajr && now < maghrib
}

// Hitung arah kiblat
export function calculateQiblaDirection(latitude, longitude) {
    const kaabaLat = 21.4225
    const kaabaLng = 39.8262

    const lat1 = (latitude * Math.PI) / 180
    const lat2 = (kaabaLat * Math.PI) / 180
    const lng1 = (longitude * Math.PI) / 180
    const lng2 = (kaabaLng * Math.PI) / 180

    const dLng = lng2 - lng1

    const x = Math.sin(dLng)
    const y = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng)

    let qibla = Math.atan2(x, y)
    qibla = (qibla * 180) / Math.PI
    qibla = (qibla + 360) % 360

    return qibla
}
