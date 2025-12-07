import { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext()

export function LocationProvider({ children }) {
    const [location, setLocation] = useState(() => {
        const saved = localStorage.getItem('userLocation')
        return saved ? JSON.parse(saved) : null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const requestLocation = () => {
        setLoading(true)
        setError(null)

        if (!navigator.geolocation) {
            setError('Geolocation tidak didukung oleh browser Anda')
            setLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
                setLocation(newLocation)
                localStorage.setItem('userLocation', JSON.stringify(newLocation))
                setLoading(false)
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError('Izin lokasi ditolak. Mohon izinkan akses lokasi.')
                        break
                    case err.POSITION_UNAVAILABLE:
                        setError('Informasi lokasi tidak tersedia.')
                        break
                    case err.TIMEOUT:
                        setError('Permintaan lokasi timeout.')
                        break
                    default:
                        setError('Terjadi error yang tidak diketahui.')
                }
                setLoading(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )
    }

    useEffect(() => {
        if (!location) {
            requestLocation()
        }
    }, [])

    const clearLocation = () => {
        setLocation(null)
        localStorage.removeItem('userLocation')
    }

    return (
        <LocationContext.Provider
            value={{ location, loading, error, requestLocation, clearLocation }}
        >
            {children}
        </LocationContext.Provider>
    )
}

export function useLocation() {
    const context = useContext(LocationContext)
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider')
    }
    return context
}
