import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export interface ProteinLog {
  id?: number
  foodName: string
  proteinAmount: number
  quantity: number
  totalProtein: number
  date?: string
}

export interface SalaryRecord {
  id?: number
  year: number
  month: number
  baseSalary: number
  bonus: number
  deduction: number
  memo?: string
}

export interface ExpenseRecord {
  id?: number
  itemName: string
  price: number
  quantity: number
  totalAmount: number
  category: string
  date?: string
}

export interface FixedExpense {
  id?: number
  name: string
  amount: number
  category: string
  billingDay: number
  active: boolean
}

export const EXPENSE_CATEGORIES = [
  { value: '식비',   emoji: '🍔' },
  { value: '교통',   emoji: '🚌' },
  { value: '쇼핑',   emoji: '🛍️' },
  { value: '구독',   emoji: '📱' },
  { value: '주거',   emoji: '🏠' },
  { value: '건강',   emoji: '💊' },
  { value: '여가',   emoji: '🎮' },
  { value: '기타',   emoji: '📦' },
]

export const proteinApi = {
  getByDate: (date: string) => api.get<ProteinLog[]>(`/protein/date/${date}`).then(r => r.data),
  getByMonth: (year: number, month: number) =>
    api.get<ProteinLog[]>(`/protein/month?year=${year}&month=${month}`).then(r => r.data),
  add: (log: Omit<ProteinLog, 'id' | 'totalProtein'>) =>
    api.post<ProteinLog>('/protein', log).then(r => r.data),
  delete: (id: number) => api.delete(`/protein/${id}`),
  getRecent: () => api.get<ProteinLog[]>('/protein/recent').then(r => r.data),
}

export const salaryApi = {
  getAll: () => api.get<SalaryRecord[]>('/salary').then(r => r.data),
  add: (record: SalaryRecord) => api.post<SalaryRecord>('/salary', record).then(r => r.data),
  update: (id: number, record: SalaryRecord) => api.put<SalaryRecord>(`/salary/${id}`, record).then(r => r.data),
  delete: (id: number) => api.delete(`/salary/${id}`),
}

export const expenseApi = {
  getByDate: (date: string) => api.get<ExpenseRecord[]>(`/expense/date/${date}`).then(r => r.data),
  getByMonth: (year: number, month: number) =>
    api.get<ExpenseRecord[]>(`/expense/month?year=${year}&month=${month}`).then(r => r.data),
  add: (record: Omit<ExpenseRecord, 'id' | 'totalAmount'>) =>
    api.post<ExpenseRecord>('/expense', record).then(r => r.data),
  delete: (id: number) => api.delete(`/expense/${id}`),
  getFixed: () => api.get<FixedExpense[]>('/expense/fixed').then(r => r.data),
  addFixed: (f: Omit<FixedExpense, 'id'>) => api.post<FixedExpense>('/expense/fixed', f).then(r => r.data),
  updateFixed: (id: number, f: Omit<FixedExpense, 'id'>) =>
    api.put<FixedExpense>(`/expense/fixed/${id}`, f).then(r => r.data),
  deleteFixed: (id: number) => api.delete(`/expense/fixed/${id}`),
}

export const settingApi = {
  get: (key: string) => api.get<{ key: string; value: string }>(`/settings/${key}`).then(r => r.data),
  set: (key: string, value: string) => api.post('/settings', { key, value }),
}
