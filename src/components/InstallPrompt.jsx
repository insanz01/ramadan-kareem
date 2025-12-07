import { useState, useEffect } from 'react'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { X, Download, Share, Plus, Smartphone } from 'lucide-react'

export default function InstallPrompt() {
    const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall()
    const [showPrompt, setShowPrompt] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Check if user has dismissed the prompt before
        const hasDismissed = localStorage.getItem('pwa-install-dismissed')
        const dismissedAt = localStorage.getItem('pwa-install-dismissed-at')

        // Show prompt again after 7 days
        if (hasDismissed && dismissedAt) {
            const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24)
            if (daysSinceDismissed < 7) {
                setDismissed(true)
                return
            }
        }

        // Show prompt after 3 seconds if installable or on iOS
        const timer = setTimeout(() => {
            if ((isInstallable || isIOS) && !isInstalled && !dismissed) {
                setShowPrompt(true)
            }
        }, 3000)

        return () => clearTimeout(timer)
    }, [isInstallable, isInstalled, isIOS, dismissed])

    const handleInstall = async () => {
        const installed = await promptInstall()
        if (installed) {
            setShowPrompt(false)
        }
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        setDismissed(true)
        localStorage.setItem('pwa-install-dismissed', 'true')
        localStorage.setItem('pwa-install-dismissed-at', Date.now().toString())
    }

    if (!showPrompt || isInstalled) {
        return null
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
                onClick={handleDismiss}
            />

            {/* Prompt Modal */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
                <div className="bg-slate-900 rounded-2xl p-6 max-w-md mx-auto border border-slate-700 shadow-2xl">
                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                        aria-label="Tutup"
                    >
                        <X size={18} className="text-slate-400" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center animate-pulse-glow">
                            <Smartphone size={32} className="text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white text-center mb-2">
                        Install Aplikasi
                    </h2>

                    {/* Description */}
                    <p className="text-slate-400 text-center text-sm mb-6">
                        Install Marhaban Ramadhan untuk akses cepat dan pengalaman offline yang lebih baik.
                    </p>

                    {isIOS ? (
                        // iOS Instructions
                        <div className="space-y-4">
                            <div className="bg-slate-800 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-emerald-400 mb-3">
                                    Cara Install di iOS:
                                </h3>
                                <ol className="space-y-3 text-sm text-slate-300">
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                                        <span className="flex items-center gap-2">
                                            Tap tombol <Share size={16} className="text-blue-400" /> Share di browser
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold">2</span>
                                        <span className="flex items-center gap-2">
                                            Scroll dan tap <Plus size={16} className="text-slate-400" /> "Add to Home Screen"
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
                                        <span>Tap "Add" untuk menginstall</span>
                                    </li>
                                </ol>
                            </div>

                            <button
                                onClick={handleDismiss}
                                className="w-full btn-secondary"
                            >
                                Mengerti
                            </button>
                        </div>
                    ) : (
                        // Android/Desktop Install Button
                        <div className="space-y-3">
                            <button
                                onClick={handleInstall}
                                className="w-full btn-primary flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                Install Sekarang
                            </button>

                            <button
                                onClick={handleDismiss}
                                className="w-full btn-secondary"
                            >
                                Nanti Saja
                            </button>
                        </div>
                    )}

                    {/* Features */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-xs text-slate-500 text-center mb-3">
                            Keuntungan install aplikasi:
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="text-xs text-slate-400">
                                <span className="block text-lg mb-1">⚡</span>
                                Lebih Cepat
                            </div>
                            <div className="text-xs text-slate-400">
                                <span className="block text-lg mb-1">📴</span>
                                Offline Mode
                            </div>
                            <div className="text-xs text-slate-400">
                                <span className="block text-lg mb-1">🔔</span>
                                Notifikasi
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
