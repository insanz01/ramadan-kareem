import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import InstallPrompt from './components/InstallPrompt'
import HomePage from './pages/HomePage'
import JadwalPage from './pages/JadwalPage'
import KiblatPage from './pages/KiblatPage'
import MenuPage from './pages/MenuPage'
import KutipanPage from './pages/KutipanPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container-app py-4 pb-safe">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jadwal" element={<JadwalPage />} />
          <Route path="/kiblat" element={<KiblatPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/kutipan" element={<KutipanPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      <BottomNav />

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  )
}

