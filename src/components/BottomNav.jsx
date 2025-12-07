import { NavLink } from 'react-router-dom'
import { Home, Clock, Compass, UtensilsCrossed, BookOpen } from 'lucide-react'

const navItems = [
    { to: '/', icon: Home, label: 'Beranda' },
    { to: '/jadwal', icon: Clock, label: 'Jadwal' },
    { to: '/kiblat', icon: Compass, label: 'Kiblat' },
    { to: '/menu', icon: UtensilsCrossed, label: 'Menu' },
    { to: '/kutipan', icon: BookOpen, label: 'Kutipan' },
]

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
            <div className="container-app">
                <div className="flex justify-around items-center py-2">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${isActive
                                    ? 'text-emerald-400 bg-emerald-500/10'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        size={22}
                                        className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className="text-xs font-medium">{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
            {/* Safe area padding for iOS */}
            <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
    )
}
