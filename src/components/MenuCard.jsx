import { Clock, ChefHat, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

export default function MenuCard({ menu, onOpenDetail }) {
    return (
        <div
            className="glass rounded-2xl p-4 card-hover cursor-pointer animate-fade-in"
            onClick={() => onOpenDetail(menu)}
        >
            <div className="flex items-start gap-4">
                <div className="text-4xl">{menu.image}</div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{menu.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                        <Clock size={14} />
                        <span>{menu.cookTime}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
                        <span>Lihat resep</span>
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MenuDetail({ menu, onClose }) {
    if (!menu) return null

    return (
        <div
            className="fixed inset-0 bg-slate-900 animate-fade-in flex flex-col"
            style={{ zIndex: 9999 }}
        >
            {/* Header - Fixed at top */}
            <div className="flex-shrink-0 bg-slate-800 border-b border-slate-700 px-4 py-4 safe-area-top">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{menu.image}</span>
                        <div>
                            <h2 className="text-lg font-bold text-white">{menu.name}</h2>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Clock size={14} />
                                <span>{menu.cookTime}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
                    >
                        <X size={20} className="text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 bg-slate-900">
                <div className="max-w-2xl mx-auto">
                    {/* Ingredients */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                            Bahan-bahan
                        </h3>
                        <ul className="space-y-2">
                            {menu.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-center gap-2 text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    {ingredient}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Steps */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                            Langkah Memasak
                        </h3>
                        <ol className="space-y-3">
                            {menu.steps.map((step, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-emerald-400 text-sm flex items-center justify-center font-medium">
                                        {index + 1}
                                    </span>
                                    <p className="text-slate-300 leading-relaxed">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Tips */}
                    {menu.tips && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="flex items-start gap-3">
                                <ChefHat size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-amber-400 mb-1">Tips</h4>
                                    <p className="text-sm text-slate-300">{menu.tips}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
