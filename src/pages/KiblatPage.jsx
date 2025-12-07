import { useState, useEffect } from 'react'
import { useLocation } from '../context/LocationContext'
import { useQibla } from '../hooks/useQibla'
import { Compass, MapPin, AlertCircle, RefreshCw, Smartphone } from 'lucide-react'

export default function KiblatPage() {
    const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation()
    const {
        qiblaDirection,
        compassHeading,
        qiblaRotation,
        isSupported,
        permissionGranted,
        requestPermission,
        error: qiblaError
    } = useQibla(location?.latitude, location?.longitude)

    const [isCalibrating, setIsCalibrating] = useState(false)

    // Simulate calibration
    const handleCalibrate = () => {
        setIsCalibrating(true)
        setTimeout(() => setIsCalibrating(false), 3000)
    }

    if (locationLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                <RefreshCw size={48} className="text-emerald-400 animate-rotate mb-4" />
                <p className="text-slate-400">Mencari lokasi Anda...</p>
            </div>
        )
    }

    if (locationError || !location) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                <AlertCircle size={48} className="text-red-400 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Lokasi Diperlukan</h2>
                <p className="text-slate-400 mb-4 max-w-xs">
                    {locationError || 'Aktifkan lokasi untuk menentukan arah kiblat yang akurat'}
                </p>
                <button onClick={requestLocation} className="btn-primary">
                    <MapPin size={18} className="inline mr-2" />
                    Aktifkan Lokasi
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Arah Kiblat</h1>
                <p className="text-sm text-slate-400">
                    Arah Ka'bah dari lokasi Anda
                </p>
            </div>

            {/* Compass */}
            <div className="glass rounded-2xl p-6">
                <div className="relative w-64 h-64 mx-auto">
                    {/* Compass Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-slate-700">
                        {/* Direction Labels */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-emerald-400">U</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-slate-500">S</div>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">B</div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">T</div>
                    </div>

                    {/* Compass Background */}
                    <div
                        className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center"
                        style={{
                            transform: `rotate(${-compassHeading}deg)`,
                            transition: 'transform 0.3s ease-out'
                        }}
                    >
                        {/* Compass Markings */}
                        {[...Array(36)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-0.5 bg-slate-600"
                                style={{
                                    height: i % 3 === 0 ? '12px' : '6px',
                                    top: '8px',
                                    left: '50%',
                                    transform: `translateX(-50%) rotate(${i * 10}deg)`,
                                    transformOrigin: 'center 112px'
                                }}
                            />
                        ))}

                        {/* Qibla Direction - Kaaba */}
                        <div
                            className="absolute w-full h-full compass-needle"
                            style={{
                                transform: `rotate(${qiblaDirection || 0}deg)`
                            }}
                        >
                            {/* Kaaba Icon pointing to Qibla */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2">
                                <span className="text-2xl drop-shadow-lg">🕋</span>
                            </div>
                        </div>
                    </div>

                    {/* Center Circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg animate-pulse-glow">
                            <Compass size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Qibla Degrees */}
                <div className="text-center mt-6">
                    <p className="text-4xl font-bold text-gradient-gold">
                        {qiblaDirection ? `${Math.round(qiblaDirection)}°` : '--°'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">dari arah Utara</p>
                </div>
            </div>

            {/* Compass Permission for Mobile */}
            {isSupported && !permissionGranted && (
                <div className="glass rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Smartphone size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-white mb-1">Kompas Digital</h3>
                            <p className="text-sm text-slate-400 mb-3">
                                Aktifkan sensor kompas untuk mendapatkan arah kiblat yang lebih akurat secara real-time.
                            </p>
                            <button onClick={requestPermission} className="btn-secondary text-sm">
                                Aktifkan Kompas
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Calibration */}
            <div className="glass rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <RefreshCw size={20} className={`text-emerald-400 flex-shrink-0 mt-0.5 ${isCalibrating ? 'animate-rotate' : ''}`} />
                    <div>
                        <h3 className="font-medium text-white mb-1">Kalibrasi Kompas</h3>
                        <p className="text-sm text-slate-400 mb-3">
                            Jika arah kiblat tidak akurat, gerakkan ponsel membentuk angka 8 untuk kalibrasi sensor.
                        </p>
                        <button
                            onClick={handleCalibrate}
                            disabled={isCalibrating}
                            className="btn-secondary text-sm"
                        >
                            {isCalibrating ? 'Mengkalibrasi...' : 'Kalibrasi'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Location Info */}
            <div className="glass rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Informasi Lokasi</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500">Latitude</p>
                        <p className="text-white font-mono">{location.latitude.toFixed(6)}°</p>
                    </div>
                    <div>
                        <p className="text-slate-500">Longitude</p>
                        <p className="text-white font-mono">{location.longitude.toFixed(6)}°</p>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {qiblaError && (
                <div className="glass rounded-xl p-4 border border-red-500/30 bg-red-500/10">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-300">{qiblaError}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
