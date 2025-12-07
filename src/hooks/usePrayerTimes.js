import { useState, useEffect } from 'react'

const ALADHAN_API = 'https://api.aladhan.com/v1'

export function usePrayerTimes(latitude, longitude, method = 20) {
    // method 20 = Kemenag Indonesia
    const [prayerTimes, setPrayerTimes] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!latitude || !longitude) {
            setLoading(false)
            return
        }

        const fetchPrayerTimes = async () => {
            setLoading(true)
            setError(null)

            try {
                const today = new Date()
                const response = await fetch(
                    `${ALADHAN_API}/timings/${Math.floor(today.getTime() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=${method}`
                )

                if (!response.ok) {
                    throw new Error('Gagal mengambil data jadwal sholat')
                }

                const data = await response.json()

                if (data.code === 200 && data.data) {
                    setPrayerTimes({
                        ...data.data.timings,
                        date: data.data.date,
                        meta: data.data.meta
                    })
                } else {
                    throw new Error('Format data tidak valid')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPrayerTimes()
    }, [latitude, longitude, method])

    return { prayerTimes, loading, error }
}

export function useMonthlyPrayerTimes(latitude, longitude, month, year, method = 20) {
    const [monthlyTimes, setMonthlyTimes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!latitude || !longitude) {
            setLoading(false)
            return
        }

        const fetchMonthlyTimes = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch(
                    `${ALADHAN_API}/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`
                )

                if (!response.ok) {
                    throw new Error('Gagal mengambil data jadwal bulanan')
                }

                const data = await response.json()

                if (data.code === 200 && data.data) {
                    setMonthlyTimes(data.data)
                } else {
                    throw new Error('Format data tidak valid')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMonthlyTimes()
    }, [latitude, longitude, month, year, method])

    return { monthlyTimes, loading, error }
}

// Helper untuk mendapatkan waktu sholat berikutnya
export function getNextPrayer(prayerTimes) {
    if (!prayerTimes) return null

    const now = new Date()
    const prayers = [
        { name: 'Imsak', time: prayerTimes.Imsak, arabicName: 'إمساك' },
        { name: 'Subuh', time: prayerTimes.Fajr, arabicName: 'الفجر' },
        { name: 'Terbit', time: prayerTimes.Sunrise, arabicName: 'الشروق' },
        { name: 'Dzuhur', time: prayerTimes.Dhuhr, arabicName: 'الظهر' },
        { name: 'Ashar', time: prayerTimes.Asr, arabicName: 'العصر' },
        { name: 'Maghrib', time: prayerTimes.Maghrib, arabicName: 'المغرب' },
        { name: 'Isya', time: prayerTimes.Isha, arabicName: 'العشاء' },
    ]

    for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number)
        const prayerDate = new Date()
        prayerDate.setHours(hours, minutes, 0, 0)

        if (prayerDate > now) {
            return {
                ...prayer,
                datetime: prayerDate
            }
        }
    }

    // If all prayers passed, return Imsak for tomorrow
    const [hours, minutes] = prayers[0].time.split(':').map(Number)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(hours, minutes, 0, 0)

    return {
        ...prayers[0],
        datetime: tomorrow
    }
}
