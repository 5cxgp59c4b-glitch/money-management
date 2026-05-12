export interface Category {
  id: string
  name: string
  color: string
}

export interface Expense {
  id: string
  categoryId: string
  amount: number
  date: string
  memo: string
}

export type TabType = 'record' | 'analytics'
