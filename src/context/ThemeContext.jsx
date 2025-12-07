import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode')
        return saved !== null ? JSON.parse(saved) : true
    })

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
        if (darkMode) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }, [darkMode])

    const toggleDarkMode = () => setDarkMode(!darkMode)

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
