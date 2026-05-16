import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { expenseApi, settingApi, EXPENSE_CATEGORIES, type ExpenseRecord, type FixedExpense } from '../api'
import ExpenseCalendar from '../components/ExpenseCalendar'

const CATEGORY_COLORS: Record<string, string> = {
  '식비': '#fb923c', '교통': '#60a5fa', '쇼핑': '#f472b6',
  '구독': '#a78bfa', '주거': '#34d399', '건강': '#4ade80',
  '여가': '#fbbf24', '기타': '#9ca3af',
}

const pad = (n: number) => String(n).padStart(2, '0')
const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const formatWon = (n: number) => n.toLocaleString('ko-KR') + '원'
const getCategoryEmoji = (cat: string) => EXPENSE_CATEGORIES.find(c => c.value === cat)?.emoji ?? '📦'

type ModalMode = 'expense' | 'fixed' | null
type EditTarget = { type: 'fixed'; data: FixedExpense } | null

export default function ExpensePage() {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(toDateKey(today))
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth() + 1)
  const [records, setRecords] = useState<ExpenseRecord[]>([])
  const [monthRecords, setMonthRecords] = useState<ExpenseRecord[]>([])
  const [fixedList, setFixedList] = useState<FixedExpense[]>([])
  const [budget, setBudget] = useState(0)
  const [activeTab, setActiveTab] = useState<'record' | 'fixed'>('record')
  const [showCalendar, setShowCalendar] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editTarget, setEditTarget] = useState<EditTarget>(null)

  const [expenseForm, setExpenseForm] = useState({ itemName: '', price: '', quantity: '1', category: '식비' })
  const [fixedForm, setFixedForm] = useState({ name: '', amount: '', category: '구독', billingDay: '1', active: true })

  const loadRecords = useCallback((date: string) => {
    expenseApi.getByDate(date).then(setRecords).catch(() => setRecords([]))
  }, [])

  const loadMonthRecords = useCallback((year: number, month: number) => {
    expenseApi.getByMonth(year, month).then(setMonthRecords).catch(() => setMonthRecords([]))
  }, [])

  const loadFixed = useCallback(() => {
    expenseApi.getFixed().then(setFixedList).catch(() => setFixedList([]))
  }, [])

  useEffect(() => { loadRecords(selectedDate) }, [selectedDate, loadRecords])
  useEffect(() => { loadMonthRecords(calYear, calMonth) }, [calYear, calMonth, loadMonthRecords])
  useEffect(() => { loadFixed() }, [loadFixed])
  useEffect(() => {
    settingApi.get('expense_monthly_budget').then(r => { if (r.value) setBudget(Number(r.value)) }).catch(() => {})
  }, [])

  // 달력용 날짜별 합산
  const dayMap = monthRecords.reduce<Record<string, { total: number }>>((acc, r) => {
    const key = r.date ?? ''
    if (!acc[key]) acc[key] = { total: 0 }
    acc[key].total += r.totalAmount
    return acc
  }, {})

  // 이번달 집계
  const monthVariableTotal = monthRecords.reduce((s, r) => s + r.totalAmount, 0)
  const monthFixedTotal = fixedList.filter(f => f.active).reduce((s, f) => s + f.amount, 0)
  const monthTotal = monthVariableTotal + monthFixedTotal
  const budgetPercent = budget > 0 ? Math.min((monthTotal / budget) * 100, 100) : 0
  const budgetRemaining = budget > 0 ? budget - monthTotal : 0

  // 카테고리별 집계 (도넛 차트)
  const categoryData = Object.entries(
    monthRecords.reduce<Record<string, number>>((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.totalAmount
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const dayTotal = records.reduce((s, r) => s + r.totalAmount, 0)
  const isToday = selectedDate === toDateKey(today)

  const openExpenseModal = () => {
    setExpenseForm({ itemName: '', price: '', quantity: '1', category: '식비' })
    setModalMode('expense')
  }

  const openFixedModal = (target?: FixedExpense) => {
    if (target) {
      setEditTarget({ type: 'fixed', data: target })
      setFixedForm({ name: target.name, amount: String(target.amount), category: target.category, billingDay: String(target.billingDay), active: target.active })
    } else {
      setEditTarget(null)
      setFixedForm({ name: '', amount: '', category: '구독', billingDay: '1', active: true })
    }
    setModalMode('fixed')
  }

  const handleAddExpense = async () => {
    if (!expenseForm.itemName || !expenseForm.price) return
    const created = await expenseApi.add({
      itemName: expenseForm.itemName,
      price: Number(expenseForm.price),
      quantity: Number(expenseForm.quantity) || 1,
      category: expenseForm.category,
      date: selectedDate,
    })
    setRecords(prev => [created, ...prev])
    setMonthRecords(prev => [...prev, created])
    setModalMode(null)
  }

  const handleDeleteExpense = async (id: number) => {
    await expenseApi.delete(id)
    setRecords(prev => prev.filter(r => r.id !== id))
    setMonthRecords(prev => prev.filter(r => r.id !== id))
  }

  const handleSaveFixed = async () => {
    if (!fixedForm.name || !fixedForm.amount) return
    const payload = {
      name: fixedForm.name,
      amount: Number(fixedForm.amount),
      category: fixedForm.category,
      billingDay: Number(fixedForm.billingDay) || 1,
      active: fixedForm.active,
    }
    if (editTarget?.type === 'fixed' && editTarget.data.id) {
      const updated = await expenseApi.updateFixed(editTarget.data.id, payload)
      setFixedList(prev => prev.map(f => f.id === editTarget.data.id ? updated : f))
    } else {
      const created = await expenseApi.addFixed(payload)
      setFixedList(prev => [...prev, created])
    }
    setModalMode(null)
    setEditTarget(null)
  }

  const handleDeleteFixed = async (id: number) => {
    await expenseApi.deleteFixed(id)
    setFixedList(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="pb-24 px-4 pt-6">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-orange-400">지출 관리 💸</h1>
          <p className="text-sm text-gray-400">{calYear}년 {calMonth}월 총 {formatWon(monthTotal)}</p>
        </div>
        <button
          onClick={() => setShowCalendar(v => !v)}
          className={`text-2xl w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${showCalendar ? 'bg-orange-100' : 'bg-gray-100'}`}
        >
          📅
        </button>
      </div>

      {/* 이번달 요약 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-3xl px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">변동 지출</p>
          <p className="text-lg font-extrabold text-orange-400">{formatWon(monthVariableTotal)}</p>
        </div>
        <div className="bg-white rounded-3xl px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">고정비</p>
          <p className="text-lg font-extrabold text-purple-400">{formatWon(monthFixedTotal)}</p>
        </div>
      </div>

      {/* 예산 프로그레스바 */}
      {budget > 0 && (
        <div className="bg-white rounded-3xl px-5 py-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-600">이번달 예산</p>
            <p className="text-sm font-extrabold text-gray-700">
              {formatWon(monthTotal)}
              <span className="text-gray-400 font-normal"> / {formatWon(budget)}</span>
            </p>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                budgetPercent >= 90 ? 'bg-red-400' :
                budgetPercent >= 70 ? 'bg-yellow-400' : 'bg-emerald-400'
              }`}
            />
          </div>
          <p className={`text-xs font-semibold mt-1.5 ${budgetRemaining >= 0 ? 'text-gray-400' : 'text-red-400'}`}>
            {budgetRemaining >= 0
              ? `${formatWon(budgetRemaining)} 남음 (${budgetPercent.toFixed(0)}%)`
              : `예산 ${formatWon(Math.abs(budgetRemaining))} 초과 🚨`}
          </p>
        </div>
      )}

      {/* 카테고리 도넛 차트 */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-3xl px-4 py-4 shadow-sm mb-4">
          <p className="text-sm font-bold text-gray-500 mb-2">카테고리별 지출</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={2}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#9ca3af'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [formatWon(Number(v)), '']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {categoryData.sort((a, b) => b.value - a.value).map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[d.name] ?? '#9ca3af' }} />
                    <span className="text-xs text-gray-500">{EXPENSE_CATEGORIES.find(c => c.value === d.name)?.emoji} {d.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">{formatWon(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 달력 */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <ExpenseCalendar
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

      {/* 탭 */}
      <div className="flex gap-2 mb-4">
        {(['record', 'fixed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === tab ? 'bg-orange-400 text-white shadow-sm' : 'bg-white text-gray-400'
            }`}
          >
            {tab === 'record' ? '📋 지출 기록' : '📌 고정비'}
          </button>
        ))}
      </div>

      {/* 지출 기록 탭 */}
      {activeTab === 'record' && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-500">
              {isToday ? '오늘' : selectedDate.slice(5).replace('-', '/')} · {formatWon(dayTotal)}
            </p>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {records.map(r => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl px-5 py-4 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">
                      {getCategoryEmoji(r.category)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-700">{r.itemName}</p>
                      <p className="text-orange-400 font-semibold text-sm">
                        {formatWon(r.price)} × {r.quantity}개 = <span className="font-extrabold">{formatWon(r.totalAmount)}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => r.id && handleDeleteExpense(r.id)}
                    className="text-gray-300 hover:text-red-400 text-xl transition-colors ml-2"
                  >×</button>
                </motion.div>
              ))}
            </AnimatePresence>

            {records.length === 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-gray-300 text-sm font-semibold mt-8"
              >
                아직 지출 기록이 없어요 💸
              </motion.p>
            )}
          </div>
        </>
      )}

      {/* 고정비 탭 */}
      {activeTab === 'fixed' && (
        <div className="space-y-3">
          {fixedList.length > 0 && (
            <p className="text-xs text-gray-400 text-right">
              활성 고정비 합계: <span className="font-bold text-purple-400">{formatWon(monthFixedTotal)}</span>
            </p>
          )}
          <AnimatePresence>
            {fixedList.map(f => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`bg-white rounded-3xl px-5 py-4 shadow-sm flex items-center justify-between ${!f.active ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-xl">
                    {getCategoryEmoji(f.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-700">{f.name}</p>
                      {!f.active && <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">중지</span>}
                    </div>
                    <p className="text-purple-400 font-semibold text-sm">
                      {formatWon(f.amount)} · 매월 {f.billingDay}일
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => openFixedModal(f)} className="text-gray-300 hover:text-purple-400 text-sm transition-colors">수정</button>
                  <button onClick={() => f.id && handleDeleteFixed(f.id)} className="text-gray-300 hover:text-red-400 text-xl transition-colors">×</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {fixedList.length === 0 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-300 text-sm font-semibold mt-8"
            >
              구독료, 월세 같은 고정비를 등록해보세요 📌
            </motion.p>
          )}
        </div>
      )}

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => activeTab === 'record' ? openExpenseModal() : openFixedModal()}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-orange-400 text-white text-3xl shadow-lg flex items-center justify-center"
      >
        +
      </motion.button>

      {/* 지출 추가 모달 */}
      <AnimatePresence>
        {modalMode === 'expense' && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalMode(null)}
              className="fixed inset-0 bg-black/30 z-[55]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-3xl px-6 pt-6 pb-10 z-[60]"
            >
              <div className="w-10 h-1.5 rounded-full bg-gray-200 mx-auto mb-4" />
              <h2 className="text-lg font-extrabold text-gray-700 mb-5">지출 추가 💸</h2>

              {/* 카테고리 선택 */}
              <div className="flex gap-2 flex-wrap mb-4">
                {EXPENSE_CATEGORIES.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setExpenseForm(f => ({ ...f, category: c.value }))}
                    className={`px-3 py-1.5 rounded-2xl text-sm font-bold transition-all ${
                      expenseForm.category === c.value
                        ? 'bg-orange-400 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {c.emoji} {c.value}
                  </button>
                ))}
              </div>

              <input
                className="w-full border border-orange-100 rounded-2xl px-4 py-3 mb-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="품목명 (예: 아이폰 케이스)"
                value={expenseForm.itemName}
                onChange={e => setExpenseForm(f => ({ ...f, itemName: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1 ml-1">가격 (원/개)</p>
                  <input
                    className="w-full border border-orange-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder="예: 15000"
                    type="number"
                    value={expenseForm.price}
                    onChange={e => setExpenseForm(f => ({ ...f, price: e.target.value }))}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 ml-1">수량</p>
                  <input
                    className="w-full border border-orange-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder="예: 2"
                    type="number"
                    value={expenseForm.quantity}
                    onChange={e => setExpenseForm(f => ({ ...f, quantity: e.target.value }))}
                  />
                </div>
              </div>

              {expenseForm.price && expenseForm.quantity && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center text-orange-400 font-bold text-sm mb-4"
                >
                  총 {formatWon(Number(expenseForm.price) * Number(expenseForm.quantity))}
                </motion.p>
              )}

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddExpense}
                className="w-full bg-orange-400 text-white font-bold py-4 rounded-2xl text-base"
              >
                추가하기
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 고정비 모달 */}
      <AnimatePresence>
        {modalMode === 'fixed' && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setModalMode(null); setEditTarget(null) }}
              className="fixed inset-0 bg-black/30 z-[55]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-3xl px-6 pt-6 pb-10 z-[60]"
            >
              <div className="w-10 h-1.5 rounded-full bg-gray-200 mx-auto mb-4" />
              <h2 className="text-lg font-extrabold text-gray-700 mb-5">
                {editTarget ? '고정비 수정' : '고정비 추가'} 📌
              </h2>

              <div className="flex gap-2 flex-wrap mb-4">
                {EXPENSE_CATEGORIES.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setFixedForm(f => ({ ...f, category: c.value }))}
                    className={`px-3 py-1.5 rounded-2xl text-sm font-bold transition-all ${
                      fixedForm.category === c.value
                        ? 'bg-purple-400 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {c.emoji} {c.value}
                  </button>
                ))}
              </div>

              <input
                className="w-full border border-purple-100 rounded-2xl px-4 py-3 mb-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="항목명 (예: 넷플릭스)"
                value={fixedForm.name}
                onChange={e => setFixedForm(f => ({ ...f, name: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1 ml-1">금액 (원/월)</p>
                  <input
                    className="w-full border border-purple-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="예: 17000"
                    type="number"
                    value={fixedForm.amount}
                    onChange={e => setFixedForm(f => ({ ...f, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 ml-1">결제일</p>
                  <input
                    className="w-full border border-purple-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="예: 15"
                    type="number"
                    min="1" max="31"
                    value={fixedForm.billingDay}
                    onChange={e => setFixedForm(f => ({ ...f, billingDay: e.target.value }))}
                  />
                </div>
              </div>

              {editTarget && (
                <div className="flex items-center gap-3 mb-4 px-1">
                  <button
                    onClick={() => setFixedForm(f => ({ ...f, active: !f.active }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${fixedForm.active ? 'bg-purple-400' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${fixedForm.active ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="text-sm font-semibold text-gray-500">{fixedForm.active ? '활성' : '중지'}</span>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSaveFixed}
                className="w-full bg-purple-400 text-white font-bold py-4 rounded-2xl text-base"
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
