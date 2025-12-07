import { useState, useEffect } from 'react'
import { Calendar, Clock, Gift } from 'lucide-react'
import { formatCountdown } from '../utils/helpers'

// Ramadhan 2026 is expected to start around February 17, 2026
// Eid al-Fitr around March 19, 2026
const RAMADHAN_2026_START = new Date('2026-02-17T00:00:00')
const RAMADHAN_2026_END = new Date('2026-03-19T00:00:00')

export default function RamadhanCounter() {
    const [now, setNow] = useState(new Date())
    const [status, setStatus] = useState('before') // 'before', 'during', 'after'
    const [countdown, setCountdown] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
    const [ramadhanDay, setRamadhanDay] = useState(0)

    useEffect(() => {
        const updateStatus = () => {
            const current = new Date()
            setNow(current)

            if (current < RAMADHAN_2026_START) {
                setStatus('before')
                const diff = RAMADHAN_2026_START - current
                setCountdown(formatCountdown(diff))
            } else if (current >= RAMADHAN_2026_START && current < RAMADHAN_2026_END) {
                setStatus('during')
                const day = Math.floor((current - RAMADHAN_2026_START) / (1000 * 60 * 60 * 24)) + 1
                setRamadhanDay(day)

                const diff = RAMADHAN_2026_END - current
                setCountdown(formatCountdown(diff))
            } else {
                setStatus('after')
            }
        }

        updateStatus()
        const interval = setInterval(updateStatus, 1000)

        return () => clearInterval(interval)
    }, [])

    const renderCountdownBoxes = () => (
        <div className="flex justify-center gap-3">
            {[
                { value: countdown.days, label: 'Hari' },
                { value: countdown.hours, label: 'Jam' },
                { value: countdown.minutes, label: 'Menit' },
                { value: countdown.seconds, label: 'Detik' },
            ].map(({ value, label }, index) => (
                <div key={label} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="countdown-digit text-2xl md:text-3xl">
                        {value}
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">{label}</span>
                </div>
            ))}
        </div>
    )

    if (status === 'before') {
        return (
            <div className="glass rounded-2xl p-6 text-center animate-fade-in overflow-hidden relative">
                {/* Decorative background */}
                <div className="absolute inset-0 islamic-pattern opacity-30" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center animate-float">
                            <Calendar size={32} className="text-slate-900" />
                        </div>
                    </div>

                    <h2 className="text-lg text-slate-300 mb-1">Menuju Ramadhan 1447 H</h2>
                    <p className="text-sm text-slate-500 mb-6">17 Februari 2026</p>

                    {renderCountdownBoxes()}

                    <p className="mt-6 text-sm text-emerald-400">
                        Persiapkan diri untuk bulan penuh berkah 🌙
                    </p>
                </div>
            </div>
        )
    }

    if (status === 'during') {
        return (
            <div className="glass rounded-2xl p-6 text-center animate-fade-in overflow-hidden relative">
                {/* Decorative background */}
                <div className="absolute inset-0 islamic-pattern opacity-30" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center animate-pulse-glow">
                            <span className="text-3xl font-bold text-white">{ramadhanDay}</span>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gradient-gold mb-1">
                        Ramadhan Hari ke-{ramadhanDay}
                    </h2>
                    <p className="text-sm text-slate-400 mb-6">
                        {ramadhanDay <= 10 ? 'Bulan Rahmat' : ramadhanDay <= 20 ? 'Bulan Ampunan' : 'Bulan Pembebasan dari Api Neraka'}
                    </p>

                    <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-2">Menuju Idul Fitri</p>
                        {renderCountdownBoxes()}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Progres Ramadhan</span>
                            <span>{Math.round((ramadhanDay / 30) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-600 to-gold-500 rounded-full transition-all duration-1000"
                                style={{ width: `${(ramadhanDay / 30) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="glass rounded-2xl p-6 text-center animate-fade-in">
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center animate-float">
                    <Gift size={32} className="text-slate-900" />
                </div>
            </div>

            <h2 className="text-xl font-bold text-gradient-gold mb-2">
                Taqabbalallahu Minna Wa Minkum
            </h2>
            <p className="text-sm text-slate-400">
                Selamat Hari Raya Idul Fitri 1447 H
            </p>
            <p className="mt-4 text-lg arabic-text text-emerald-400">
                عيد مبارك
            </p>
        </div>
    )
}
