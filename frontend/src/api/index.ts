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

export const proteinApi = {
  getByDate: (date: string) => api.get<ProteinLog[]>(`/protein/date/${date}`).then(r => r.data),
  getByMonth: (year: number, month: number) =>
    api.get<ProteinLog[]>(`/protein/month?year=${year}&month=${month}`).then(r => r.data),
  add: (log: Omit<ProteinLog, 'id' | 'totalProtein'>) =>
    api.post<ProteinLog>('/protein', log).then(r => r.data),
  delete: (id: number) => api.delete(`/protein/${id}`),
}

export const salaryApi = {
  getAll: () => api.get<SalaryRecord[]>('/salary').then(r => r.data),
  add: (record: SalaryRecord) => api.post<SalaryRecord>('/salary', record).then(r => r.data),
  update: (id: number, record: SalaryRecord) => api.put<SalaryRecord>(`/salary/${id}`, record).then(r => r.data),
  delete: (id: number) => api.delete(`/salary/${id}`),
}

export const settingApi = {
  get: (key: string) => api.get<{ key: string; value: string }>(`/settings/${key}`).then(r => r.data),
  set: (key: string, value: string) => api.post('/settings', { key, value }),
}
