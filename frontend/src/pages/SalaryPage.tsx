import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { salaryApi, type SalaryRecord } from '../api'

const now = new Date()

const emptyForm = (): Omit<SalaryRecord, 'id'> => ({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  baseSalary: 0,
  bonus: 0,
  deduction: 0,
  memo: '',
})

const netOf = (r: SalaryRecord) => (r.baseSalary || 0) + (r.bonus || 0) - (r.deduction || 0)

export default function SalaryPage() {
  const [records, setRecords] = useState<SalaryRecord[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<SalaryRecord | null>(null)
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    salaryApi.getAll().then(setRecords).catch(() => setRecords([]))
  }, [])

  const latest = records[0]
  const prev = records[1]
  const netSalary = latest ? netOf(latest) : 0
  const prevNet = prev ? netOf(prev) : 0
  const diff = latest && prev ? netSalary - prevNet : null
  const isSalaryUp = diff !== null ? diff >= 0 : false

  const chartData = records
    .slice(0, 6)
    .reverse()
    .map(r => ({ name: `${r.month}월`, 실수령: netOf(r) }))

  const openAdd = () => {
    setEditTarget(null)
    setForm(emptyForm())
    setShowModal(true)
  }

  const openEdit = (r: SalaryRecord) => {
    setEditTarget(r)
    setForm({ year: r.year, month: r.month, baseSalary: r.baseSalary, bonus: r.bonus, deduction: r.deduction, memo: r.memo || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editTarget?.id) {
        const updated = await salaryApi.update(editTarget.id, { ...form, id: editTarget.id })
        setRecords(prev => prev.map(r => r.id === editTarget.id ? updated : r))
      } else {
        const created = await salaryApi.add(form)
        setRecords(prev => [created, ...prev])
      }
      setShowModal(false)
    } catch {
      alert('저장에 실패했어요. 다시 시도해주세요.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await salaryApi.delete(id)
      setRecords(prev => prev.filter(r => r.id !== id))
    } catch {
      alert('삭제에 실패했어요.')
    }
  }

  const formatWon = (n: number) => n.toLocaleString('ko-KR') + '원'

  return (
    <div className="pb-24 px-4 pt-6">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-violet-500">급여 관리 💰</h1>
          <p className="text-sm text-gray-400">내 월급 현황</p>
        </div>
        <motion.img
          src="/rabbits/salary-money.png"
          alt=""
          className="w-20 h-20 object-contain"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* 이번달 요약 카드 */}
      {latest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-400 to-purple-500 rounded-3xl p-5 text-white mb-6 shadow-lg flex items-center justify-between"
        >
          <div>
            <p className="text-sm opacity-80 mb-1">{latest.year}년 {latest.month}월 실수령액</p>
            <p className="text-3xl font-extrabold">{formatWon(netSalary)}</p>
            <div className="flex gap-3 mt-2 text-xs opacity-80 flex-wrap">
              <span>기본 {formatWon(latest.baseSalary || 0)}</span>
              {(latest.bonus || 0) > 0 && <span>보너스 +{formatWon(latest.bonus || 0)}</span>}
              {(latest.deduction || 0) > 0 && <span>공제 -{formatWon(latest.deduction || 0)}</span>}
            </div>
            {diff !== null && (
              <p className={`text-xs font-bold mt-2 ${isSalaryUp ? 'text-green-300' : 'text-red-300'}`}>
                {isSalaryUp ? '▲' : '▼'} 전월 대비 {formatWon(Math.abs(diff))}
              </p>
            )}
          </div>
          <img
            src={isSalaryUp ? '/rabbits/salary-up.png' : '/rabbits/budget.png'}
            alt=""
            className="w-20 h-20 object-contain flex-shrink-0"
          />
        </motion.div>
      )}

      {/* 차트 */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-3xl px-4 py-5 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <img src="/rabbits/stats-chart.png" alt="" className="w-10 h-10 object-contain" />
            <p className="text-sm font-bold text-gray-500">최근 6개월</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={28}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [Number(v).toLocaleString() + '원', '실수령']}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="실수령" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 목록 */}
      <div className="space-y-3">
        <AnimatePresence>
          {records.map((r, i) => {
            const net = netOf(r)
            const prevR = records[i + 1]
            const d = prevR ? net - netOf(prevR) : null
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl px-5 py-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-gray-700">{r.year}년 {r.month}월</p>
                  <p className="text-violet-400 font-semibold text-sm">{formatWon(net)}</p>
                  {d !== null && (
                    <p className={`text-xs font-semibold mt-0.5 ${d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {d >= 0 ? '▲' : '▼'} {formatWon(Math.abs(d))}
                    </p>
                  )}
                  {r.memo && <p className="text-xs text-gray-400 mt-0.5">{r.memo}</p>}
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => openEdit(r)} className="text-gray-300 hover:text-violet-400 text-sm transition-colors">수정</button>
                  <button onClick={() => r.id && handleDelete(r.id)} className="text-gray-300 hover:text-red-400 text-xl transition-colors">×</button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {records.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-300 text-sm font-semibold mt-8"
          >
            급여 기록을 추가해보세요 💸
          </motion.p>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={openAdd}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-violet-400 text-white text-3xl shadow-lg flex items-center justify-center"
      >
        +
      </motion.button>

      {/* 바텀시트 모달 */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/30 z-[55]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-3xl px-6 pt-6 pb-10 z-[60]"
            >
              <div className="w-10 h-1.5 rounded-full bg-gray-200 mx-auto mb-4" />
              <div className="flex items-center gap-3 mb-5">
                <img src="/rabbits/salary-money.png" alt="" className="w-14 h-14 object-contain" />
                <h2 className="text-lg font-extrabold text-gray-700">
                  {editTarget ? '급여 수정' : '급여 추가'} 💰
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  className="border border-violet-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="연도"
                  type="number"
                  value={form.year}
                  onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                />
                <input
                  className="border border-violet-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="월"
                  type="number"
                  value={form.month}
                  onChange={e => setForm(f => ({ ...f, month: Number(e.target.value) }))}
                />
              </div>
              {[
                { key: 'baseSalary', label: '기본급 (원)' },
                { key: 'bonus', label: '보너스 (원)' },
                { key: 'deduction', label: '공제액 (원)' },
              ].map(({ key, label }) => (
                <input
                  key={key}
                  className="w-full border border-violet-100 rounded-2xl px-4 py-3 mb-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder={label}
                  type="number"
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: Number(e.target.value) }))}
                />
              ))}
              <input
                className="w-full border border-violet-100 rounded-2xl px-4 py-3 mb-5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-300"
                placeholder="메모 (선택)"
                value={form.memo}
                onChange={e => setForm(f => ({ ...f, memo: e.target.value }))}
              />
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSave}
                className="w-full bg-violet-400 text-white font-bold py-4 rounded-2xl text-base"
              >
                저장하기
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
