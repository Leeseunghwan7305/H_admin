import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { settingApi } from '../api'

const formatBudget = (n: number) => {
  if (n >= 100000000) return `${(n / 100000000).toFixed(n % 100000000 === 0 ? 0 : 1)}억원`
  if (n >= 10000) return `${(n / 10000).toFixed(n % 10000 === 0 ? 0 : 1)}만원`
  return `${n.toLocaleString()}원`
}

const MULTIPLIERS = [
  { label: '1.2x', desc: '일반 활동', color: 'emerald' },
  { label: '1.6x', desc: '운동 중', color: 'emerald' },
  { label: '2.0x', desc: '고강도 훈련', color: 'emerald' },
]

export default function SettingsPage() {
  const [weight, setWeight] = useState('')
  const [selectedMult, setSelectedMult] = useState<number | null>(null)
  const [customGoal, setCustomGoal] = useState('')
  const [expenseBudget, setExpenseBudget] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    settingApi.get('protein_daily_goal').then(r => { if (r.value) setCustomGoal(r.value) }).catch(() => {})
    settingApi.get('protein_body_weight').then(r => { if (r.value) setWeight(r.value) }).catch(() => {})
    settingApi.get('protein_multiplier').then(r => { if (r.value) setSelectedMult(Number(r.value)) }).catch(() => {})
    settingApi.get('expense_monthly_budget').then(r => { if (r.value) setExpenseBudget(r.value) }).catch(() => {})
  }, [])

  const calcGoal = (mult: number) =>
    weight ? Math.round(Number(weight) * mult) : null

  const handleSelectMult = (mult: number) => {
    setSelectedMult(mult)
    const goal = calcGoal(mult)
    if (goal) setCustomGoal(String(goal))
  }

  const handleSave = async () => {
    await settingApi.set('protein_daily_goal', customGoal)
    await settingApi.set('protein_body_weight', weight)
    if (selectedMult) await settingApi.set('protein_multiplier', String(selectedMult))
    if (expenseBudget) await settingApi.set('expense_monthly_budget', expenseBudget)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-500">설정 ⚙️</h1>
          <p className="text-sm text-gray-400">목표를 설정해요</p>
        </div>
        <img src="/rabbits/protein-muscle.png" alt="" className="w-20 h-20 object-contain" />
      </div>

      {/* 몸무게 입력 */}
      <div className="bg-white rounded-3xl px-5 py-5 shadow-sm mb-4">
        <p className="font-extrabold text-gray-700 mb-1">내 몸무게</p>
        <p className="text-xs text-gray-400 mb-3">입력하면 목표 단백질을 자동 계산해줘요</p>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 border border-emerald-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="kg"
            type="number"
            value={weight}
            onChange={e => {
              setWeight(e.target.value)
              if (selectedMult) setCustomGoal(String(Math.round(Number(e.target.value) * selectedMult)))
            }}
          />
          <span className="text-gray-400 font-bold">kg</span>
        </div>
      </div>

      {/* 배수 선택 */}
      <div className="bg-white rounded-3xl px-5 py-5 shadow-sm mb-4">
        <p className="font-extrabold text-gray-700 mb-1">활동 강도</p>
        <p className="text-xs text-gray-400 mb-3">운동 강도에 따라 권장 단백질이 달라요</p>
        <div className="grid grid-cols-3 gap-2">
          {MULTIPLIERS.map(({ label, desc }) => {
            const mult = parseFloat(label)
            const goal = calcGoal(mult)
            const isSelected = selectedMult === mult
            return (
              <motion.button
                key={label}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectMult(mult)}
                className={`rounded-2xl py-3 px-2 text-center border-2 transition-all ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <p className={`text-lg font-extrabold ${isSelected ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                {goal && (
                  <p className={`text-xs font-bold mt-1 ${isSelected ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {goal}g
                  </p>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* 목표 단백질 (직접 수정 가능) */}
      <div className="bg-white rounded-3xl px-5 py-5 shadow-sm mb-6">
        <p className="font-extrabold text-gray-700 mb-1">하루 목표 단백질</p>
        <p className="text-xs text-gray-400 mb-3">직접 입력해서 바꿀 수도 있어요</p>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 border border-emerald-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="예: 150"
            type="number"
            value={customGoal}
            onChange={e => setCustomGoal(e.target.value)}
          />
          <span className="text-gray-400 font-bold">g</span>
        </div>
      </div>

      {/* 월 지출 예산 */}
      <div className="bg-white rounded-3xl px-5 py-5 shadow-sm mb-6">
        <p className="font-extrabold text-gray-700 mb-1">월 지출 예산 💸</p>
        <p className="text-xs text-gray-400 mb-3">지출 탭에서 예산 대비 진행률을 확인할 수 있어요</p>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 border border-orange-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="예: 500000"
            type="number"
            value={expenseBudget}
            onChange={e => setExpenseBudget(e.target.value)}
          />
          <span className="text-gray-400 font-bold">원</span>
        </div>
        {expenseBudget && Number(expenseBudget) > 0 && (
          <p className="text-sm font-extrabold text-orange-400 mt-2 ml-1">
            {formatBudget(Number(expenseBudget))}
          </p>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleSave}
        className={`w-full font-bold py-4 rounded-2xl text-base transition-colors ${
          saved ? 'bg-emerald-300 text-white' : 'bg-emerald-400 text-white'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={saved ? 'saved' : 'save'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {saved ? '✅ 저장됐어요!' : '저장하기'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
