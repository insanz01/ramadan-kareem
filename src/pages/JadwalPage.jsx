import { useState } from 'react'
import { Calendar, Settings, Info } from 'lucide-react'
import PrayerTimesCard from '../components/PrayerTimesCard'
import { useLocation } from '../context/LocationContext'
import { useSettings } from '../context/SettingsContext'

const CALCULATION_METHODS = [
    { id: 20, name: 'Kemenag Indonesia', description: 'Kementerian Agama RI' },
    { id: 4, name: 'Umm Al-Qura', description: 'Saudi Arabia' },
    { id: 2, name: 'ISNA', description: 'Islamic Society of North America' },
    { id: 3, name: 'MWL', description: 'Muslim World League' },
    { id: 5, name: 'Egyptian', description: 'Egyptian General Authority' },
]

export default function JadwalPage() {
    const { settings, updateSetting } = useSettings()
    const [showSettings, setShowSettings] = useState(false)
    const { location } = useLocation()

    const method = settings.prayerMethod
    const setMethod = (id) => updateSetting('prayerMethod', id)

    return (
        <div className="space-y-4 animate-fade-in pt-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Jadwal Sholat</h1>
                    <p className="text-sm text-slate-400">
                        Waktu sholat berdasarkan lokasi Anda
                    </p>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-xl transition-colors ${showSettings ? 'bg-emerald-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                        }`}
                >
                    <Settings size={20} />
                </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="glass rounded-xl p-4 animate-slide-up">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Metode Perhitungan</h3>
                    <div className="space-y-2">
                        {CALCULATION_METHODS.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMethod(m.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${method === m.id
                                    ? 'bg-emerald-600/20 border border-emerald-500/30'
                                    : 'bg-slate-800/30 hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="font-medium text-white">{m.name}</div>
                                <div className="text-xs text-slate-400">{m.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Location Info */}
            {location && (
                <div className="glass rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Info size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="text-slate-300 mb-1">Koordinat Lokasi</p>
                            <p className="text-slate-500">
                                {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Prayer Times */}
            <PrayerTimesCard />

            {/* Info Card */}
            <div className="glass rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Keterangan</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span><strong>Imsak:</strong> Waktu berhenti makan sahur</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span><strong>Subuh:</strong> Awal waktu sholat Subuh</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gold-500" />
                        <span><strong>Terbit:</strong> Matahari terbit (tidak boleh sholat)</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span><strong>Maghrib:</strong> Waktu berbuka puasa</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
