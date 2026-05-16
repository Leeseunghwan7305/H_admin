import { motion } from 'framer-motion'

interface DayData {
  total: number
}

interface Props {
  year: number
  month: number
  dayMap: Record<string, DayData>
  selectedDate: string
  onSelectDate: (date: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')
const toKey = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`


const formatShort = (n: number) => {
  if (n >= 10000) return `${Math.floor(n / 1000)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

export default function ExpenseCalendar({
  year, month, dayMap, selectedDate, onSelectDate, onPrevMonth, onNextMonth,
}: Props) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = new Date()
  const todayKey = toKey(today.getFullYear(), today.getMonth() + 1, today.getDate())

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="bg-white rounded-3xl px-4 py-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">‹</button>
        <p className="font-extrabold text-gray-700">{year}년 {month}월</p>
        <button onClick={onNextMonth} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">›</button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <p key={d} className={`text-center text-xs font-bold py-1 ${d === '일' ? 'text-red-400' : d === '토' ? 'text-blue-400' : 'text-gray-400'}`}>
            {d}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const key = toKey(year, month, day)
          const isSelected = key === selectedDate
          const isToday = key === todayKey
          const data = dayMap[key]

          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.85 }}
              onClick={() => onSelectDate(key)}
              className={`flex flex-col items-center py-1 rounded-2xl transition-all ${isSelected ? 'bg-orange-50' : ''}`}
            >
              <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                isToday ? 'bg-orange-400 text-white' :
                isSelected ? 'text-orange-500' :
                i % 7 === 0 ? 'text-red-400' :
                i % 7 === 6 ? 'text-blue-400' : 'text-gray-600'
              }`}>
                {day}
              </span>
              {data && data.total > 0 ? (
                <span className={`text-[10px] font-bold leading-none mt-1 ${
                  data.total >= 100000 ? 'text-red-400' :
                  data.total >= 30000 ? 'text-yellow-500' : 'text-emerald-500'
                }`}>
                  {formatShort(data.total)}
                </span>
              ) : (
                <span className="h-[10px] mt-1" />
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="flex gap-4 justify-center mt-3">
        {[
          { color: 'bg-emerald-400', label: '3만 미만' },
          { color: 'bg-yellow-400', label: '3만~10만' },
          { color: 'bg-red-400',    label: '10만 이상' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
