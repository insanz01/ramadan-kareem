import { useState, useEffect } from 'react'
import { usePrayerTimes, getNextPrayer } from '../hooks/usePrayerTimes'
import { useLocation } from '../context/LocationContext'
import { useSettings } from '../context/SettingsContext'
import { Clock, Sunrise, Sun, Sunset, Moon, CloudMoon } from 'lucide-react'

const prayerIcons = {
    Imsak: CloudMoon,
    Subuh: Moon,
    Terbit: Sunrise,
    Dzuhur: Sun,
    Ashar: Sun,
    Maghrib: Sunset,
    Isya: Moon
}

export default function PrayerTimesCard({ compact = false }) {
    const { location } = useLocation()
    const { settings } = useSettings()
    const { prayerTimes, loading, error } = usePrayerTimes(
        location?.latitude,
        location?.longitude,
        settings.prayerMethod
    )
    const [nextPrayer, setNextPrayer] = useState(null)
    const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        if (prayerTimes) {
            const next = getNextPrayer(prayerTimes)
            setNextPrayer(next)
        }
    }, [prayerTimes])

    useEffect(() => {
        if (!nextPrayer) return

        const updateCountdown = () => {
            const now = new Date()
            const diff = nextPrayer.datetime - now

            if (diff <= 0) {
                // Refresh prayer times
                const next = getNextPrayer(prayerTimes)
                setNextPrayer(next)
                return
            }

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setCountdown({ hours, minutes, seconds })
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 1000)

        return () => clearInterval(interval)
    }, [nextPrayer, prayerTimes])

    if (loading) {
        return (
            <div className="glass rounded-2xl p-4 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-slate-700/50 rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="glass rounded-2xl p-4 text-center">
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        )
    }

    if (!prayerTimes) {
        return (
            <div className="glass rounded-2xl p-4 text-center">
                <p className="text-slate-400 text-sm">Menunggu lokasi...</p>
            </div>
        )
    }

    const prayers = [
        { name: 'Imsak', time: prayerTimes.Imsak },
        { name: 'Subuh', time: prayerTimes.Fajr },
        { name: 'Terbit', time: prayerTimes.Sunrise },
        { name: 'Dzuhur', time: prayerTimes.Dhuhr },
        { name: 'Ashar', time: prayerTimes.Asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isya', time: prayerTimes.Isha },
    ]

    const displayPrayers = compact
        ? prayers.filter(p => ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'].includes(p.name))
        : prayers

    return (
        <div className="glass rounded-2xl p-4 animate-fade-in">
            {/* Next Prayer Countdown */}
            {nextPrayer && (
                <div className="mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Waktu berikutnya</span>
                        <span className="text-xs text-emerald-400 arabic-text">{nextPrayer.arabicName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center animate-pulse-glow">
                                {(() => {
                                    const IconComponent = prayerIcons[nextPrayer.name] || Clock
                                    return <IconComponent size={24} className="text-white" />
                                })()}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{nextPrayer.name}</h3>
                                <p className="text-sm text-slate-400">{nextPrayer.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex gap-1">
                                <span className="countdown-digit">{String(countdown.hours).padStart(2, '0')}</span>
                                <span className="text-xl text-slate-500 self-center">:</span>
                                <span className="countdown-digit">{String(countdown.minutes).padStart(2, '0')}</span>
                                <span className="text-xl text-slate-500 self-center">:</span>
                                <span className="countdown-digit">{String(countdown.seconds).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Prayer Times List */}
            <div className="space-y-2">
                {displayPrayers.map((prayer) => {
                    const isNext = nextPrayer?.name === prayer.name
                    const IconComponent = prayerIcons[prayer.name] || Clock

                    return (
                        <div
                            key={prayer.name}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${isNext
                                ? 'prayer-active'
                                : 'bg-slate-800/30 hover:bg-slate-800/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <IconComponent
                                    size={18}
                                    className={isNext ? 'text-emerald-300' : 'text-slate-500'}
                                />
                                <span className={`font-medium ${isNext ? 'text-white' : 'text-slate-300'}`}>
                                    {prayer.name}
                                </span>
                            </div>
                            <span className={`font-mono ${isNext ? 'text-emerald-300' : 'text-slate-400'}`}>
                                {prayer.time}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
