import { Bell, BellOff, Clock, Volume2, VolumeX, ChevronRight, AlertCircle } from 'lucide-react'
import { useNotificationSettings } from '../context/NotificationContext'

const PRAYER_LIST = [
    { key: 'Imsak', name: 'Imsak', description: 'Waktu berhenti sahur' },
    { key: 'Fajr', name: 'Subuh', description: 'Sholat Subuh' },
    { key: 'Sunrise', name: 'Terbit', description: 'Matahari terbit' },
    { key: 'Dhuhr', name: 'Dzuhur', description: 'Sholat Dzuhur' },
    { key: 'Asr', name: 'Ashar', description: 'Sholat Ashar' },
    { key: 'Maghrib', name: 'Maghrib', description: 'Waktu berbuka & sholat' },
    { key: 'Isha', name: 'Isya', description: 'Sholat Isya' },
]

const REMINDER_OPTIONS = [
    { value: 0, label: 'Tidak ada' },
    { value: 5, label: '5 menit' },
    { value: 10, label: '10 menit' },
    { value: 15, label: '15 menit' },
    { value: 30, label: '30 menit' },
]

export default function NotificationSettings() {
    const {
        isSupported,
        permission,
        settings,
        updateSettings,
        toggleNotifications,
        togglePrayer
    } = useNotificationSettings()

    if (!isSupported) {
        return (
            <div className="glass rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-white mb-1">Notifikasi Tidak Didukung</h3>
                        <p className="text-sm text-slate-400">
                            Browser Anda tidak mendukung notifikasi. Coba gunakan browser modern seperti Chrome, Firefox, atau Edge.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Main Toggle */}
            <div className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.enabled
                            ? 'bg-emerald-600/20 text-emerald-400'
                            : 'bg-slate-700 text-slate-400'
                            }`}>
                            {settings.enabled ? <Bell size={20} /> : <BellOff size={20} />}
                        </div>
                        <div>
                            <h3 className="font-medium text-white">Notifikasi Waktu Sholat</h3>
                            <p className="text-xs text-slate-400">
                                {permission === 'denied'
                                    ? 'Izin ditolak - aktifkan di pengaturan browser'
                                    : settings.enabled
                                        ? 'Aktif'
                                        : 'Nonaktif'
                                }
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={toggleNotifications}
                        disabled={permission === 'denied'}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-emerald-600' : 'bg-slate-600'
                            } ${permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.enabled ? 'left-7' : 'left-1'
                            }`} />
                    </button>
                </div>

                {permission === 'denied' && (
                    <p className="mt-3 text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">
                        ⚠️ Notifikasi diblokir. Buka pengaturan browser untuk mengizinkan notifikasi dari situs ini.
                    </p>
                )}
            </div>

            {settings.enabled && (
                <>
                    {/* Reminder Time */}
                    <div className="bg-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Clock size={18} className="text-emerald-400" />
                            <h3 className="font-medium text-white">Pengingat Sebelum Waktu</h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {REMINDER_OPTIONS.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => updateSettings({ reminderMinutes: option.value })}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${settings.reminderMinutes === option.value
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Prayer Selection */}
                    <div className="bg-slate-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700">
                            <h3 className="font-medium text-white">Pilih Waktu Notifikasi</h3>
                            <p className="text-xs text-slate-400 mt-1">Aktifkan notifikasi untuk waktu sholat tertentu</p>
                        </div>

                        <div className="divide-y divide-slate-700">
                            {PRAYER_LIST.map(prayer => (
                                <button
                                    key={prayer.key}
                                    onClick={() => togglePrayer(prayer.key)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="text-left">
                                        <span className="font-medium text-white">{prayer.name}</span>
                                        <p className="text-xs text-slate-400">{prayer.description}</p>
                                    </div>

                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${settings.prayers[prayer.key]
                                        ? 'bg-emerald-600 border-emerald-600'
                                        : 'border-slate-500'
                                        }`}>
                                        {settings.prayers[prayer.key] && (
                                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sound Settings */}
                    <div className="bg-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.sound
                                        ? 'bg-emerald-600/20 text-emerald-400'
                                        : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    {settings.sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Suara Adzan</h3>
                                    <p className="text-xs text-slate-400">
                                        {settings.sound ? 'Aktif' : 'Nonaktif'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => updateSettings({ sound: !settings.sound })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.sound ? 'bg-emerald-600' : 'bg-slate-600'
                                    }`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.sound ? 'left-7' : 'left-1'
                                    }`} />
                            </button>
                        </div>

                        {settings.sound && (
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-300">Volume</span>
                                    <span className="text-sm text-slate-400">{Math.round(settings.soundVolume * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={settings.soundVolume}
                                    onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                                    className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Subuh menggunakan adzan khusus, waktu lain menggunakan adzan reguler
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Info */}
            <div className="bg-slate-800/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">ℹ️ Informasi</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Notifikasi bekerja saat aplikasi terbuka atau PWA terinstall</li>
                    <li>• Untuk notifikasi background, install aplikasi sebagai PWA</li>
                    <li>• Pastikan tidak menutup browser/app sepenuhnya</li>
                </ul>
            </div>
        </div>
    )
}
