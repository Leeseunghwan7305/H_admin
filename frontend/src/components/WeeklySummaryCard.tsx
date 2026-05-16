interface DayBar {
  label: string    // 월·화·수...
  date: string     // YYYY-MM-DD
  value: number
  isToday: boolean
}

interface Stat {
  label: string
  value: string
  color?: string
}

interface Props {
  title: string
  days: DayBar[]
  stats: Stat[]
  goal?: number           // protein용 목표치
  maxValue?: number       // 막대 최대 기준 (미지정 시 자동)
  barColor: (value: number, goal?: number) => string
}

export default function WeeklySummaryCard({ title, days, stats, goal, maxValue, barColor }: Props) {
  const max = maxValue ?? Math.max(...days.map(d => d.value), goal ?? 1, 1)

  return (
    <div className="bg-white rounded-3xl px-5 py-4 shadow-sm mb-4">
      <p className="text-sm font-bold text-gray-500 mb-3">{title}</p>

      {/* 막대 그래프 */}
      <div className="flex items-end gap-1.5 h-14 mb-2">
        {days.map(day => {
          const heightPct = max > 0 ? Math.min((day.value / max) * 100, 100) : 0
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex-1 bg-gray-100 rounded-t-lg relative overflow-hidden">
                <div
                  className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${
                    day.value > 0 ? barColor(day.value, goal) : ''
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold ${day.isToday ? 'text-pink-400' : 'text-gray-400'}`}>
                {day.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* 통계 */}
      <div className="flex gap-4">
        {stats.map(s => (
          <div key={s.label}>
            <p className="text-[10px] text-gray-400">{s.label}</p>
            <p className={`text-sm font-extrabold ${s.color ?? 'text-gray-700'}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
