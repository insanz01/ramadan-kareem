import { useState } from 'react'
import { Sunrise, Sunset, RefreshCw } from 'lucide-react'
import { getAllMenus, getRandomMenu } from '../data/menus'
import MenuCard, { MenuDetail } from '../components/MenuCard'

export default function MenuPage() {
    const [activeTab, setActiveTab] = useState('sahur')
    const [selectedMenu, setSelectedMenu] = useState(null)
    const [randomMenu, setRandomMenu] = useState(null)

    const menus = getAllMenus(activeTab)

    const handleRandomMenu = () => {
        const random = getRandomMenu(activeTab)
        setRandomMenu(random)
        setSelectedMenu(random)
    }

    return (
        <div className="space-y-4 animate-fade-in pt-2">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Menu Ramadhan</h1>
                <p className="text-sm text-slate-400">
                    Inspirasi menu sahur & buka puasa yang mudah dan bergizi
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('sahur')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${activeTab === 'sahur'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                        }`}
                >
                    <Sunrise size={18} />
                    Sahur
                </button>
                <button
                    onClick={() => setActiveTab('bukaPuasa')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${activeTab === 'bukaPuasa'
                        ? 'bg-gradient-to-r from-gold-500 to-orange-500 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                        }`}
                >
                    <Sunset size={18} />
                    Buka Puasa
                </button>
            </div>

            {/* Random Menu Button */}
            <button
                onClick={handleRandomMenu}
                className="w-full glass rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-slate-700/30 transition-colors group"
            >
                <RefreshCw size={20} className="text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-slate-300">Pilih Menu Acak</span>
            </button>

            {/* Menu Description */}
            <div className="glass rounded-xl p-4">
                <p className="text-sm text-slate-400">
                    {activeTab === 'sahur' ? (
                        <>
                            Menu sahur yang <span className="text-emerald-400">mudah</span>, <span className="text-emerald-400">cepat</span>, dan <span className="text-emerald-400">mengenyangkan</span> untuk energi sepanjang hari.
                        </>
                    ) : (
                        <>
                            Menu berbuka yang <span className="text-gold-400">segar</span>, <span className="text-gold-400">manis</span>, dan <span className="text-gold-400">bergizi</span> untuk mengembalikan energi.
                        </>
                    )}
                </p>
            </div>

            {/* Menu Grid */}
            <div className="grid gap-4">
                {menus.map((menu, index) => (
                    <div
                        key={menu.id}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        className="animate-slide-up"
                    >
                        <MenuCard menu={menu} onOpenDetail={setSelectedMenu} />
                    </div>
                ))}
            </div>

            {/* Menu Detail Modal */}
            {selectedMenu && (
                <MenuDetail menu={selectedMenu} onClose={() => setSelectedMenu(null)} />
            )}
        </div>
    )
}
