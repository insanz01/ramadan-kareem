import { useState, useEffect } from 'react'
import { Moon, Sun, MapPin, RefreshCw, Download } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLocation } from '../context/LocationContext'
import { usePWAInstall } from '../hooks/usePWAInstall'

export default function Header() {
    const { darkMode, toggleDarkMode } = useTheme()
    const { location, loading, requestLocation } = useLocation()
    const { isInstallable, promptInstall } = usePWAInstall()
    const [cityName, setCityName] = useState('Mencari lokasi...')

    useEffect(() => {
        if (location) {
            // Reverse geocoding to get city name
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=id`)
                .then(res => res.json())
                .then(data => {
                    setCityName(data.city || data.locality || data.principalSubdivision || 'Lokasi Anda')
                })
                .catch(() => {
                    setCityName('Lokasi Anda')
                })
        }
    }, [location])

    return (
        <header className="sticky top-0 z-40 glass border-b border-white/10">
            <div className="container-app">
                <div className="flex items-center justify-between py-3">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🌙</span>
                        <div>
                            <h1 className="text-lg font-bold text-gradient-gold">Marhaban</h1>
                            <p className="text-xs text-slate-400 -mt-1">Ramadhan</p>
                        </div>
                    </div>

                    {/* Location & Actions */}
                    <div className="flex items-center gap-2">
                        {/* Location */}
                        <button
                            onClick={requestLocation}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                        >
                            {loading ? (
                                <RefreshCw size={14} className="animate-rotate text-emerald-400" />
                            ) : (
                                <MapPin size={14} className="text-emerald-400" />
                            )}
                            <span className="text-xs text-slate-300 max-w-[80px] truncate">
                                {cityName}
                            </span>
                        </button>

                        {/* Install Button - Only shows when installable */}
                        {isInstallable && (
                            <button
                                onClick={promptInstall}
                                className="p-2 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 transition-colors animate-pulse-glow"
                                aria-label="Install App"
                                title="Install Aplikasi"
                            >
                                <Download size={18} className="text-emerald-400" />
                            </button>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <Sun size={18} className="text-gold-400" />
                            ) : (
                                <Moon size={18} className="text-slate-300" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
