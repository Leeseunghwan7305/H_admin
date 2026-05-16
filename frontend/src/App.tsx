import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import ProteinPage from './pages/ProteinPage'
import SettingsPage from './pages/SettingsPage'
import ExpensePage from './pages/ExpensePage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-[#fef6fb]">
        <Routes>
          <Route path="/" element={<ProteinPage />} />
          <Route path="/expense" element={<ExpensePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
