import { useState, useEffect } from 'react'
import { getDailyQuote } from '../data/quotes'
import { Quote, Share2, Copy, Check, BookOpen } from 'lucide-react'

export default function DailyQuote({ showFull = false }) {
    const [quote, setQuote] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const dailyQuote = getDailyQuote()
        setQuote(dailyQuote)
    }, [])

    const handleCopy = async () => {
        if (!quote) return

        const text = `"${quote.text}"\n\n- ${quote.source}`

        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleShare = async () => {
        if (!quote || !navigator.share) return

        try {
            await navigator.share({
                title: 'Kutipan Islami',
                text: `"${quote.text}"\n\n- ${quote.source}`,
                url: window.location.href
            })
        } catch (err) {
            console.error('Failed to share:', err)
        }
    }

    if (!quote) {
        return (
            <div className="glass rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
                <div className="space-y-2">
                    <div className="h-4 bg-slate-700/50 rounded w-full" />
                    <div className="h-4 bg-slate-700/50 rounded w-3/4" />
                </div>
            </div>
        )
    }

    return (
        <div className="glass rounded-2xl p-6 animate-fade-in overflow-hidden relative">
            {/* Decorative quote marks */}
            <div className="absolute top-4 left-4 opacity-5">
                <Quote size={80} className="text-emerald-500" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${quote.type === 'quran'
                                ? 'bg-emerald-600/20 text-emerald-400'
                                : 'bg-gold-500/20 text-gold-400'
                            }`}>
                            <BookOpen size={16} />
                        </div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">
                            {quote.type === 'quran' ? 'Al-Quran' : 'Hadits'}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                            aria-label="Copy quote"
                        >
                            {copied ? (
                                <Check size={16} className="text-emerald-400" />
                            ) : (
                                <Copy size={16} className="text-slate-400" />
                            )}
                        </button>

                        {navigator.share && (
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                                aria-label="Share quote"
                            >
                                <Share2 size={16} className="text-slate-400" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Arabic Text */}
                {showFull && quote.arabicText && (
                    <p className="text-xl md:text-2xl text-emerald-400 arabic-text text-center mb-4 leading-loose">
                        {quote.arabicText}
                    </p>
                )}

                {/* Quote Text */}
                <blockquote className="text-lg md:text-xl text-slate-200 leading-relaxed mb-4">
                    "{quote.text}"
                </blockquote>

                {/* Source */}
                <p className={`text-sm font-medium ${quote.type === 'quran' ? 'text-emerald-400' : 'text-gold-400'
                    }`}>
                    — {quote.source}
                </p>
            </div>
        </div>
    )
}
