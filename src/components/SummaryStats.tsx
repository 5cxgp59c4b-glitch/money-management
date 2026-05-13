import type { Expense, Income } from '../types'
import { getCurrentFiscalYear } from '../utils/fiscalYear'

interface Props {
  expenses: Expense[]
  incomes: Income[]
}

const fmt = new Intl.NumberFormat('ja-JP')

function getThisMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function SummaryStats({ expenses, incomes }: Props) {
  const thisMonth = getThisMonthKey()
  const fy = getCurrentFiscalYear()
  const aprilKey = `${fy}-04`

  const thisMonthExpense = expenses
    .filter((e) => e.date.startsWith(thisMonth))
    .reduce((s, e) => s + e.amount, 0)

  const thisMonthIncome = incomes
    .filter((i) => i.date.startsWith(thisMonth))
    .reduce((s, i) => s + i.amount, 0)

  // 4月初め（前年度末）の累計残高 ÷ 12 = 今月の使用可能額
  const incomeBeforeApril = incomes
    .filter((i) => i.date.slice(0, 7) < aprilKey)
    .reduce((s, i) => s + i.amount, 0)
  const expenseBeforeApril = expenses
    .filter((e) => e.date.slice(0, 7) < aprilKey)
    .reduce((s, e) => s + e.amount, 0)
  const balanceAtApril = incomeBeforeApril - expenseBeforeApril
  const monthlyAvailable = Math.floor(balanceAtApril / 12)

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0)
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0)
  const totalBalance = totalIncome - totalExpense

  return (
    <div className="stats-row">
      <div className="stat-card stat-card-teal">
        <span className="stat-label">今月の収入</span>
        <span className="stat-value">¥{fmt.format(thisMonthIncome)}</span>
      </div>
      <div className="stat-card stat-card-peach">
        <span className="stat-label">今月の支出</span>
        <span className="stat-value">¥{fmt.format(thisMonthExpense)}</span>
      </div>
      <div className={`stat-card ${monthlyAvailable >= 0 ? 'stat-card-mint' : 'stat-card-coral'}`}>
        <span className="stat-label">今月の使用可能額</span>
        <span className="stat-value">
          {monthlyAvailable < 0 ? '-' : ''}¥{fmt.format(Math.abs(monthlyAvailable))}
        </span>
      </div>
      <div className={`stat-card ${totalBalance >= 0 ? 'stat-card-lavender' : 'stat-card-coral'}`}>
        <span className="stat-label">総残高</span>
        <span className="stat-value">
          {totalBalance < 0 ? '-' : ''}¥{fmt.format(Math.abs(totalBalance))}
        </span>
      </div>
    </div>
  )
}
