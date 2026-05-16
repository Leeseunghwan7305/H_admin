import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import ProteinPage from './pages/ProteinPage'
import SalaryPage from './pages/SalaryPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-[#fef6fb]">
        <Routes>
          <Route path="/" element={<ProteinPage />} />
          <Route path="/salary" element={<SalaryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
