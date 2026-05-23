import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { proteinApi, settingApi, type ProteinLog } from '../api'
import ProteinCalendar from '../components/ProteinCalendar'
import WeeklySummaryCard from '../components/WeeklySummaryCard'

const pad = (n: number) => String(n).padStart(2, '0')
const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const hour = new Date().getHours()
const isNight = hour >= 21 || hour < 6

const getMascot = (percent: number) => {
  if (isNight) return '/rabbits/night-meal.png'
  if (percent >= 100) return '/rabbits/goal-achieved.png'
  if (percent >= 50) return '/rabbits/goal-progress.png'
  if (percent > 0) return '/rabbits/protein-workout.png'
  return '/rabbits/protein-daily.png'
}


export default function ProteinPage() {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(toDateKey(today))
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth() + 1)
  const [logs, setLogs] = useState<ProteinLog[]>([])
  const [monthLogs, setMonthLogs] = useState<ProteinLog[]>([])
  const [recentFoods, setRecentFoods] = useState<ProteinLog[]>([])
  const [goal, setGoal] = useState(150)
  const [showModal, setShowModal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [form, setForm] = useState({ foodName: '', proteinAmount: '', quantity: '1' })

  const total = logs.reduce((sum, l) => sum + l.totalProtein, 0)
  const percent = Math.min((total / goal) * 100, 100)

  const loadGoal = useCallback(() => {
    settingApi.get('protein_daily_goal').then(r => { if (r.value) setGoal(Number(r.value)) }).catch(() => {})
  }, [])

  const loadLogs = useCallback((date: string) => {
    proteinApi.getByDate(date).then(setLogs).catch(() => setLogs([]))
  }, [])

  const loadMonthLogs = useCallback((year: number, month: number) => {
    proteinApi.getByMonth(year, month).then(setMonthLogs).catch(() => setMonthLogs([]))
  }, [])

  useEffect(() => {
    proteinApi.getRecent().then(setRecentFoods).catch(() => {})
  }, [])

  useEffect(() => {
    loadGoal()
  }, [loadGoal])

  useEffect(() => {
    loadLogs(selectedDate)
  }, [selectedDate, loadLogs])

  useEffect(() => {
    loadMonthLogs(calYear, calMonth)
  }, [calYear, calMonth, loadMonthLogs])

  // 주간 데이터
  const weekDays = (() => {
    const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']
    const todayKey = toDateKey(today)
    const diff = today.getDay() === 0 ? -6 : 1 - today.getDay()
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + diff + i)
      const date = toDateKey(d)
      const dayLogs = monthLogs.filter(l => l.date === date)
      return { label: DAY_LABELS[i], date, value: dayLogs.reduce((s, l) => s + l.totalProtein, 0), isToday: date === todayKey }
    })
  })()
  const weekTotal = weekDays.reduce((s, d) => s + d.value, 0)
  const weekAvg = Math.round(weekTotal / 7)
  const weekAchieved = weekDays.filter(d => d.value >= goal).length

  // 달력용 날짜별 합산 맵
  const dayMap = monthLogs.reduce<Record<string, { total: number; goal: number }>>((acc, log) => {
    const key = log.date ?? ''
    if (!acc[key]) acc[key] = { total: 0, goal }
    acc[key].total += log.totalProtein
    return acc
  }, {})

  const handleAdd = async () => {
    if (!form.foodName || !form.proteinAmount) return
    try {
      const log = await proteinApi.add({
        foodName: form.foodName,
        proteinAmount: Number(form.proteinAmount),
        quantity: Number(form.quantity) || 1,
        date: selectedDate,
      })
      setLogs(prev => [log, ...prev])
      setMonthLogs(prev => [...prev, log])
      setForm({ foodName: '', proteinAmount: '', quantity: '1' })
      setShowModal(false)
    } catch {
      alert('추가에 실패했어요. 다시 시도해주세요.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await proteinApi.delete(id)
      setLogs(prev => prev.filter(l => l.id !== id))
      setMonthLogs(prev => prev.filter(l => l.id !== id))
    } catch {
      alert('삭제에 실패했어요.')
    }
  }

  const isToday = selectedDate === toDateKey(today)
  const chartData = [{ name: '단백질', value: percent, fill: '#f472b6' }]

  return (
    <div className="pb-24 px-4 pt-6">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-pink-500">
            {isToday ? (isNight ? '야식은 조심해 🌙' : '오늘의 단백질 💪') : `${selectedDate.slice(5).replace('-', '/')} 기록`}
          </h1>
          <p className="text-sm text-gray-400">목표: {goal}g</p>
        </div>
        <button
          onClick={() => setShowCalendar(v => !v)}
          className={`text-2xl w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${showCalendar ? 'bg-pink-100' : 'bg-gray-100'}`}
        >
          📅
        </button>
      </div>

      {/* 달력 */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <ProteinCalendar
              year={calYear}
              month={calMonth}
              dayMap={dayMap}
              selectedDate={selectedDate}
              onSelectDate={date => { setSelectedDate(date); setShowCalendar(false) }}
              onPrevMonth={() => {
                if (calMonth === 1) { setCalYear(y => y - 1); setCalMonth(12) }
                else setCalMonth(m => m - 1)
              }}
              onNextMonth={() => {
                if (calMonth === 12) { setCalYear(y => y + 1); setCalMonth(1) }
                else setCalMonth(m => m + 1)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 링 차트 + 마스코트 */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="relative w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="70%" outerRadius="100%"
              startAngle={90} endAngle={90 - 360 * (percent / 100)}
              data={chartData}
            >
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#fce7f3' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-pink-500">{total.toFixed(1)}g</span>
            <span className="text-xs text-gray-400">{percent.toFixed(0)}% 달성</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={getMascot(percent)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <img src={getMascot(percent)} alt="" className="w-28 h-28 object-contain" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 주간 요약 */}
      <WeeklySummaryCard
        title="이번 주 단백질"
        days={weekDays}
        goal={goal}
        barColor={(v, g) => v >= (g ?? 0) ? 'bg-emerald-400' : v >= (g ?? 0) * 0.5 ? 'bg-yellow-400' : 'bg-pink-300'}
        stats={[
          { label: '주 평균', value: `${weekAvg}g`, color: 'text-pink-500' },
          { label: '목표 달성', value: `${weekAchieved} / 7일`, color: weekAchieved >= 5 ? 'text-emerald-500' : 'text-gray-700' },
          { label: '주 합계', value: `${weekTotal.toFixed(0)}g` },
        ]}
      />

      {/* 로그 리스트 */}
      <div className="space-y-3">
        <AnimatePresence>
          {logs.map(log => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-3xl px-5 py-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img src="/rabbits/protein-log.png" alt="" className="w-10 h-10 object-contain" />
                <div>
                  <p className="font-bold text-gray-700">{log.foodName}</p>
                  <p className="text-pink-400 font-semibold text-sm">
                    {log.proteinAmount}g × {log.quantity}개 = <span className="font-extrabold">{log.totalProtein.toFixed(1)}g</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => log.id && handleDelete(log.id)}
                className="text-gray-300 hover:text-red-400 text-xl transition-colors ml-2"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {logs.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-300 text-sm font-semibold mt-8"
          >
            아직 기록이 없어요 🥹
          </motion.p>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-pink-400 text-white text-3xl shadow-lg flex items-center justify-center"
      >
        +
      </motion.button>

      {/* 바텀시트 모달 */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/30 z-[55]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-3xl px-6 pt-6 pb-10 z-[60]"
            >
              <div className="w-10 h-1.5 rounded-full bg-gray-200 mx-auto mb-4" />
              <div className="flex items-center gap-3 mb-4">
                <img src="/rabbits/meal-plan.png" alt="" className="w-14 h-14 object-contain" />
                <div>
                  <h2 className="text-lg font-extrabold text-gray-700">단백질 추가 🥩</h2>
                  <p className="text-xs text-gray-400">{selectedDate}</p>
                </div>
              </div>

              {recentFoods.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2 ml-1">최근 음식</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {recentFoods.map(f => (
                      <button
                        key={f.foodName}
                        onClick={() => setForm({ foodName: f.foodName, proteinAmount: String(f.proteinAmount), quantity: '1' })}
                        className="flex-shrink-0 px-3 py-1.5 bg-pink-50 text-pink-500 text-xs font-bold rounded-2xl border border-pink-100 whitespace-nowrap"
                      >
                        {f.foodName} {f.proteinAmount}g
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <input
                className="w-full border border-pink-100 rounded-2xl px-4 py-3 mb-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="음식 이름 (예: 닭가슴살)"
                value={form.foodName}
                onChange={e => setForm(f => ({ ...f, foodName: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1 ml-1">단백질 (g/개)</p>
                  <input
                    className="w-full border border-pink-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="예: 30"
                    type="number"
                    value={form.proteinAmount}
                    onChange={e => setForm(f => ({ ...f, proteinAmount: e.target.value }))}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 ml-1">개수</p>
                  <input
                    className="w-full border border-pink-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="예: 2"
                    type="number"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  />
                </div>
              </div>

              {form.proteinAmount && form.quantity && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-pink-400 font-bold text-sm mb-4"
                >
                  총 {(Number(form.proteinAmount) * Number(form.quantity)).toFixed(1)}g 섭취
                </motion.p>
              )}

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAdd}
                className="w-full bg-pink-400 text-white font-bold py-4 rounded-2xl text-base"
              >
                추가하기
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
