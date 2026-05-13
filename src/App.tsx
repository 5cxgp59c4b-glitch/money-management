import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Category, Expense, TabType } from './types'
import Navigation from './components/Navigation'
import ExpenseForm from './components/ExpenseForm'
import CategoryManager from './components/CategoryManager'
import ExpenseList from './components/ExpenseList'
import CategoryPieChart from './components/CategoryPieChart'
import MonthlyLineChart from './components/MonthlyLineChart'
import SummaryStats from './components/SummaryStats'
import ExportImport from './components/ExportImport'

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '食費', color: '#C84B2F' },
  { id: '2', name: '交通費', color: '#3A7BD5' },
  { id: '3', name: '娯楽', color: '#7C5BD5' },
  { id: '4', name: '日用品', color: '#5BAD6B' },
]

export default function App() {
  const [categories, setCategories] = useLocalStorage<Category[]>('mm_categories', DEFAULT_CATEGORIES)
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('mm_expenses', [])
  const [tab, setTab] = useState<TabType>('record')

  const addCategory = (cat: Category) => setCategories((prev) => [...prev, cat])
  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setExpenses((prev) => prev.filter((e) => e.categoryId !== id))
  }

  const addExpense = (exp: Expense) => setExpenses((prev) => [exp, ...prev])
  const deleteExpense = (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id))

  const handleImport = (cats: Category[], exps: Expense[]) => {
    setCategories(cats)
    setExpenses(exps)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">支</span>
            <span className="logo-text">支出管理</span>
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

        {tab === 'analytics' && (
          <div className="layout-analytics">
            <SummaryStats expenses={expenses} />
            <div className="charts-grid">
              <CategoryPieChart expenses={expenses} categories={categories} />
              <MonthlyLineChart expenses={expenses} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
