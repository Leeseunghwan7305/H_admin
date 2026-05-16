import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authApi } from '../api'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await authApi.login(username, password)
      localStorage.setItem('token', token)
      navigate('/', { replace: true })
    } catch {
      setError('아이디 또는 비밀번호가 틀렸어요 🥹')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-[#fef6fb] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <img src="/rabbits/protein-muscle.png" alt="" className="w-20 h-20 object-contain mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-emerald-500">나의 관리자</h1>
          <p className="text-sm text-gray-400 mt-1">로그인하고 시작해요</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="아이디"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="비밀번호"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center font-semibold"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="bg-emerald-400 text-white font-bold py-3 rounded-2xl text-base mt-2 disabled:opacity-60"
          >
            {loading ? '로그인 중...' : '로그인'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
