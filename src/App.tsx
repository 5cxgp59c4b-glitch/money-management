import { useCallback, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Category, Expense, Income, IncomeCategory, TabType } from './types'
import Navigation from './components/Navigation'
import ExpenseForm from './components/ExpenseForm'
import CategoryManager from './components/CategoryManager'
import ExpenseList from './components/ExpenseList'
import IncomeForm from './components/IncomeForm'
import IncomeList from './components/IncomeList'
import IncomeCategoryManager from './components/IncomeCategoryManager'
import CategoryPieChart from './components/CategoryPieChart'
import MonthlyLineChart from './components/MonthlyLineChart'
import BalanceTrendChart from './components/BalanceTrendChart'
import SummaryStats from './components/SummaryStats'
import ExportImport from './components/ExportImport'
import StorageQuotaDialog from './components/StorageQuotaDialog'

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '食費', color: '#C84B2F' },
  { id: '2', name: '交通費', color: '#3A7BD5' },
  { id: '3', name: '娯楽', color: '#7C5BD5' },
  { id: '4', name: '日用品', color: '#5BAD6B' },
]

const DEFAULT_INCOME_CATEGORIES: IncomeCategory[] = [
  { id: 'i1', name: '給与', color: '#3A7BD5' },
  { id: 'i2', name: '副業', color: '#5BAD6B' },
  { id: 'i3', name: 'ボーナス', color: '#C9B53A' },
  { id: 'i4', name: 'その他', color: '#6a6a6a' },
]

const DELETE_COUNT = 50

type QuotaState = {
  dataType: string
  onDeleteOld: () => void
  onCancel: () => void
} | null

export default function App() {
  const [quotaState, setQuotaState] = useState<QuotaState>(null)

  const handleExpenseQuota = useCallback((rollback: () => void) => {
    setQuotaState({
      dataType: '支出',
      onDeleteOld: () => {
        setExpenses(prev => {
          const sorted = [...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          const toDelete = new Set(sorted.slice(0, DELETE_COUNT).map(e => e.id))
          return prev.filter(e => !toDelete.has(e.id))
        })
        setQuotaState(null)
      },
      onCancel: () => {
        rollback()
        setQuotaState(null)
      },
    })
  }, [])

  const handleIncomeQuota = useCallback((rollback: () => void) => {
    setQuotaState({
      dataType: '収入',
      onDeleteOld: () => {
        setIncomes(prev => {
          const sorted = [...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          const toDelete = new Set(sorted.slice(0, DELETE_COUNT).map(i => i.id))
          return prev.filter(i => !toDelete.has(i.id))
        })
        setQuotaState(null)
      },
      onCancel: () => {
        rollback()
        setQuotaState(null)
      },
    })
  }, [])

  const [categories, setCategories] = useLocalStorage<Category[]>('mm_categories', DEFAULT_CATEGORIES)
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('mm_expenses', [], handleExpenseQuota)
  const [incomeCategories, setIncomeCategories] = useLocalStorage<IncomeCategory[]>('mm_income_categories', DEFAULT_INCOME_CATEGORIES)
  const [incomes, setIncomes] = useLocalStorage<Income[]>('mm_incomes', [], handleIncomeQuota)
  const [tab, setTab] = useState<TabType>('record')

  const addCategory = (cat: Category) => setCategories((prev) => [...prev, cat])
  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setExpenses((prev) => prev.filter((e) => e.categoryId !== id))
  }

  const addExpense = (exp: Expense) => setExpenses((prev) => [exp, ...prev])
  const deleteExpense = (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id))

  const addIncomeCategory = (cat: IncomeCategory) => setIncomeCategories((prev) => [...prev, cat])
  const deleteIncomeCategory = (id: string) => {
    setIncomeCategories((prev) => prev.filter((c) => c.id !== id))
    setIncomes((prev) => prev.filter((i) => i.incomeCategoryId !== id))
  }

  const addIncome = (inc: Income) => setIncomes((prev) => [inc, ...prev])
  const deleteIncome = (id: string) => setIncomes((prev) => prev.filter((i) => i.id !== id))

  const handleImport = (
    cats: Category[],
    exps: Expense[],
    incomeCats: IncomeCategory[],
    incs: Income[],
  ) => {
    setCategories(cats)
    setExpenses(exps)
    setIncomeCategories(incomeCats)
    setIncomes(incs)
  }

  return (
    <div className="app">
      {quotaState && (
        <StorageQuotaDialog
          dataType={quotaState.dataType}
          deleteCount={DELETE_COUNT}
          onDeleteOld={quotaState.onDeleteOld}
          onCancel={quotaState.onCancel}
        />
      )}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">M</span>
            <span className="logo-text">マネーマネージメント</span>
          </div>
          <Navigation active={tab} onChange={setTab} />
        </div>
      </header>

      <main className="main">
        {tab === 'record' && (
          <div className="layout-two-col">
            <div className="col-left">
              <ExpenseForm categories={categories} onAdd={addExpense} />
              <CategoryManager
                categories={categories}
                onAdd={addCategory}
                onDelete={deleteCategory}
              />
              <ExportImport
                categories={categories}
                expenses={expenses}
                incomeCategories={incomeCategories}
                incomes={incomes}
                onImport={handleImport}
              />
            </div>
            <div className="col-right">
              <ExpenseList
                expenses={expenses}
                categories={categories}
                onDelete={deleteExpense}
              />
            </div>
          </div>
        )}

        {tab === 'income' && (
          <div className="layout-two-col">
            <div className="col-left">
              <IncomeForm incomeCategories={incomeCategories} onAdd={addIncome} />
              <IncomeCategoryManager
                incomeCategories={incomeCategories}
                onAdd={addIncomeCategory}
                onDelete={deleteIncomeCategory}
              />
            </div>
            <div className="col-right">
              <IncomeList
                incomes={incomes}
                incomeCategories={incomeCategories}
                onDelete={deleteIncome}
              />
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="layout-analytics">
            <SummaryStats expenses={expenses} incomes={incomes} />
            <div className="charts-grid">
              <CategoryPieChart expenses={expenses} categories={categories} />
              <MonthlyLineChart expenses={expenses} incomes={incomes} />
            </div>
            <BalanceTrendChart expenses={expenses} incomes={incomes} />
          </div>
        )}
      </main>
    </div>
  )
}
