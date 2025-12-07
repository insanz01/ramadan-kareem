import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Compass, UtensilsCrossed, BookOpen } from 'lucide-react'
import { formatDate } from '../utils/helpers'
import PrayerTimesCard from '../components/PrayerTimesCard'
import RamadhanCounter from '../components/RamadhanCounter'
import DailyQuote from '../components/DailyQuote'

const quickLinks = [
    { to: '/jadwal', icon: Clock, label: 'Jadwal Sholat', color: 'from-emerald-600 to-emerald-700' },
    { to: '/kiblat', icon: Compass, label: 'Arah Kiblat', color: 'from-blue-600 to-blue-700' },
    { to: '/menu', icon: UtensilsCrossed, label: 'Menu Ramadhan', color: 'from-orange-600 to-orange-700' },
    { to: '/kutipan', icon: BookOpen, label: 'Kutipan Islami', color: 'from-purple-600 to-purple-700' },
]

export default function HomePage() {
    const today = new Date()

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Hero Section */}
            <section className="text-center py-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
                    Marhaban Ya Ramadhan
                </h1>
                <p className="text-slate-400">{formatDate(today)}</p>
            </section>

            {/* Ramadhan Counter */}
            <section>
                <RamadhanCounter />
            </section>

            {/* Quick Links */}
            <section>
                <div className="grid grid-cols-2 gap-3">
                    {quickLinks.map(({ to, icon: Icon, label, color }) => (
                        <Link
                            key={to}
                            to={to}
                            className="glass rounded-xl p-4 card-hover group"
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <Icon size={20} className="text-white" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-200">{label}</span>
                                <ArrowRight size={16} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Prayer Times */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-white">Jadwal Sholat</h2>
                    <Link to="/jadwal" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                        Selengkapnya <ArrowRight size={14} />
                    </Link>
                </div>
                <PrayerTimesCard compact />
            </section>

            {/* Daily Quote */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-white">Kutipan Hari Ini</h2>
                    <Link to="/kutipan" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                        Lihat Semua <ArrowRight size={14} />
                    </Link>
                </div>
                <DailyQuote />
            </section>
        </div>
    )
}
