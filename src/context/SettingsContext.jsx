import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

const DEFAULT_SETTINGS = {
    // Prayer calculation method
    prayerMethod: 20, // Kemenag Indonesia

    // Qibla compass settings
    qiblaCalibrated: false,
    qiblaCalibrationOffset: 0,

    // Display preferences
    showArabicText: true,
    showCountdown: true,
    compactMode: false,

    // Audio settings (moved from notification for better organization)
    adzanEnabled: false,
    adzanVolume: 0.7,
}

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('app-settings')
        if (saved) {
            try {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
            } catch {
                return DEFAULT_SETTINGS
            }
        }
        return DEFAULT_SETTINGS
    })

    // Save to localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem('app-settings', JSON.stringify(settings))
    }, [settings])

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }))
    }

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS)
        localStorage.removeItem('app-settings')
    }

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateSettings,
                updateSetting,
                resetSettings
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}
