import type { Expense, Income } from '../types'
import { getCurrentFiscalYear, getFiscalYearMonths } from '../utils/fiscalYear'

interface Props {
  expenses: Expense[]
  incomes: Income[]
  openingBalance: number
}

const fmt = new Intl.NumberFormat('ja-JP')

function getThisMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function SummaryStats({ expenses, incomes, openingBalance }: Props) {
  const thisMonth = getThisMonthKey()
  const fy = getCurrentFiscalYear()

  const thisMonthExpense = expenses
    .filter((e) => e.date.startsWith(thisMonth))
    .reduce((s, e) => s + e.amount, 0)

  const monthlyAvailable = Math.floor(openingBalance / 12)

  const fyMonths = new Set(getFiscalYearMonths(fy))
  const fyExpense = expenses
    .filter((e) => fyMonths.has(e.date.slice(0, 7)))
    .reduce((s, e) => s + e.amount, 0)

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0)
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0)
  const totalBalance = totalIncome - totalExpense

  return (
    <div className="stats-row">
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
      <div className="stat-card stat-card-teal">
        <span className="stat-label">{fy}年度の支出額</span>
        <span className="stat-value">¥{fmt.format(fyExpense)}</span>
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
