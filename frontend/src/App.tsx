import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BottomNav from './components/BottomNav'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import ProteinPage from './pages/ProteinPage'
import SettingsPage from './pages/SettingsPage'
import ExpensePage from './pages/ExpensePage'

function AppLayout() {
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setKeyboardOpen(true)
      }
    }
    const onFocusOut = () => setKeyboardOpen(false)

    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  return (
    <div className="min-h-svh bg-[#fef6fb]">
      <Routes>
        <Route path="/" element={<ProteinPage />} />
        <Route path="/expense" element={<ExpensePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      {!keyboardOpen && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
