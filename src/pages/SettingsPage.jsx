import { ArrowLeft, Bell, MapPin, Palette, Info, ExternalLink, Clock, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import NotificationSettings from '../components/NotificationSettings'
import { useLocation } from '../context/LocationContext'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'

const CALCULATION_METHODS = [
    { id: 20, name: 'Kemenag Indonesia', description: 'Kementerian Agama RI' },
    { id: 4, name: 'Umm Al-Qura', description: 'Saudi Arabia' },
    { id: 2, name: 'ISNA', description: 'Islamic Society of North America' },
    { id: 3, name: 'MWL', description: 'Muslim World League' },
    { id: 5, name: 'Egyptian', description: 'Egyptian General Authority' },
]

export default function SettingsPage() {
    const { location, requestLocation } = useLocation()
    const { darkMode, toggleDarkMode } = useTheme()
    const { settings, updateSetting } = useSettings()
    const [showMethodPicker, setShowMethodPicker] = useState(false)

    const currentMethod = CALCULATION_METHODS.find(m => m.id === settings.prayerMethod) || CALCULATION_METHODS[0]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    to="/"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} className="text-slate-300" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
                    <p className="text-sm text-slate-400">Konfigurasi aplikasi</p>
                </div>
            </div>

            {/* Prayer Method Section */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Clock size={18} className="text-emerald-400" />
                    <h2 className="font-semibold text-white">Metode Perhitungan</h2>
                </div>

                <div className="bg-slate-800 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setShowMethodPicker(!showMethodPicker)}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                    >
                        <div className="text-left">
                            <p className="font-medium text-white">{currentMethod.name}</p>
                            <p className="text-sm text-slate-400">{currentMethod.description}</p>
                        </div>
                        <ChevronDown
                            size={20}
                            className={`text-slate-400 transition-transform ${showMethodPicker ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {showMethodPicker && (
                        <div className="border-t border-slate-700 divide-y divide-slate-700">
                            {CALCULATION_METHODS.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => {
                                        updateSetting('prayerMethod', method.id)
                                        setShowMethodPicker(false)
                                    }}
                                    className={`w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors ${method.id === settings.prayerMethod ? 'bg-emerald-600/10' : ''
                                        }`}
                                >
                                    <div className="text-left">
                                        <span className="font-medium text-white">{method.name}</span>
                                        <p className="text-xs text-slate-400">{method.description}</p>
                                    </div>
                                    {method.id === settings.prayerMethod && (
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Metode ini akan digunakan untuk menghitung waktu sholat
                </p>
            </section>

            {/* Notification Settings Section */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Bell size={18} className="text-emerald-400" />
                    <h2 className="font-semibold text-white">Notifikasi</h2>
                </div>
                <NotificationSettings />
            </section>

            {/* Location Section */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <MapPin size={18} className="text-emerald-400" />
                    <h2 className="font-semibold text-white">Lokasi</h2>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="font-medium text-white">Lokasi Saat Ini</p>
                            <p className="text-sm text-slate-400">
                                {location
                                    ? `${location.latitude.toFixed(4)}°, ${location.longitude.toFixed(4)}°`
                                    : 'Belum tersedia'
                                }
                            </p>
                        </div>
                        <button
                            onClick={requestLocation}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Perbarui
                        </button>
                    </div>
                    <p className="text-xs text-slate-500">
                        Lokasi digunakan untuk menghitung waktu sholat dan arah kiblat yang akurat.
                    </p>
                </div>
            </section>

            {/* Appearance Section */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Palette size={18} className="text-emerald-400" />
                    <h2 className="font-semibold text-white">Tampilan</h2>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-white">Mode Gelap</p>
                            <p className="text-sm text-slate-400">Tampilan gelap untuk kenyamanan mata</p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-emerald-600' : 'bg-slate-600'
                                }`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'left-7' : 'left-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Info size={18} className="text-emerald-400" />
                    <h2 className="font-semibold text-white">Tentang</h2>
                </div>

                <div className="bg-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-300">Versi Aplikasi</span>
                        <span className="text-slate-400">1.0.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-300">API Waktu Sholat</span>
                        <a
                            href="https://aladhan.com/prayer-times-api"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 flex items-center gap-1 hover:underline"
                        >
                            Aladhan <ExternalLink size={14} />
                        </a>
                    </div>
                    <div className="pt-3 border-t border-slate-700">
                        <p className="text-xs text-slate-500 text-center">
                            🌙 Marhaban Ramadhan - Pendamping Ibadah Ramadhan
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

