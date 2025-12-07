import { useState } from 'react'
import { islamicQuotes } from '../data/quotes'
import { BookOpen, Quote, Filter, Search } from 'lucide-react'
import DailyQuote from '../components/DailyQuote'

export default function KutipanPage() {
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredQuotes = islamicQuotes.filter(quote => {
        const matchesFilter = filter === 'all' || quote.type === filter
        const matchesSearch = quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quote.source.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Kutipan Islami</h1>
                <p className="text-sm text-slate-400">
                    Inspirasi dari Al-Quran dan Hadits
                </p>
            </div>

            {/* Daily Quote Featured */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">✨</span>
                    <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Kutipan Hari Ini</h2>
                </div>
                <DailyQuote showFull />
            </div>

            {/* Search & Filter */}
            <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Cari kutipan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                    {[
                        { id: 'all', label: 'Semua' },
                        { id: 'quran', label: 'Al-Quran' },
                        { id: 'hadits', label: 'Hadits' },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setFilter(id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === id
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Result Count */}
            <p className="text-sm text-slate-500">
                Menampilkan {filteredQuotes.length} kutipan
            </p>

            {/* Quotes List */}
            <div className="space-y-4">
                {filteredQuotes.map((quote, index) => (
                    <div
                        key={quote.id}
                        className="glass rounded-xl p-4 animate-slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${quote.type === 'quran'
                                    ? 'bg-emerald-600/20 text-emerald-400'
                                    : 'bg-gold-500/20 text-gold-400'
                                }`}>
                                <BookOpen size={16} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded ${quote.type === 'quran'
                                    ? 'bg-emerald-600/20 text-emerald-400'
                                    : 'bg-gold-500/20 text-gold-400'
                                }`}>
                                {quote.type === 'quran' ? 'Al-Quran' : 'Hadits'}
                            </span>
                        </div>

                        {/* Arabic Text */}
                        {quote.arabicText && (
                            <p className="text-lg text-emerald-400 arabic-text text-right mb-3 leading-loose">
                                {quote.arabicText}
                            </p>
                        )}

                        {/* Quote */}
                        <blockquote className="text-slate-200 leading-relaxed mb-3">
                            "{quote.text}"
                        </blockquote>

                        {/* Source */}
                        <p className={`text-sm font-medium ${quote.type === 'quran' ? 'text-emerald-400' : 'text-gold-400'
                            }`}>
                            — {quote.source}
                        </p>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredQuotes.length === 0 && (
                <div className="text-center py-12">
                    <Quote size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400">Tidak ada kutipan yang ditemukan</p>
                </div>
            )}
        </div>
    )
}
