import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import ProteinPage from './pages/ProteinPage'
import SettingsPage from './pages/SettingsPage'
import ExpensePage from './pages/ExpensePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <PrivateRoute>
            <div className="min-h-svh bg-[#fef6fb]">
              <Routes>
                <Route path="/" element={<ProteinPage />} />
                <Route path="/expense" element={<ExpensePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
              <BottomNav />
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
