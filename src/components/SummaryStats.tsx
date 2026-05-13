import type { Expense } from '../types'

interface Props {
  expenses: Expense[]
}

const fmt = new Intl.NumberFormat('ja-JP')

function getThisMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function SummaryStats({ expenses }: Props) {
  const thisMonth = getThisMonthKey()
  const thisMonthTotal = expenses
    .filter((e) => e.date.startsWith(thisMonth))
    .reduce((s, e) => s + e.amount, 0)

  const allTotal = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="stats-row">
      <div className="stat-card stat-card-teal">
        <span className="stat-label">今月の支出</span>
        <span className="stat-value">¥{fmt.format(thisMonthTotal)}</span>
      </div>
      <div className="stat-card stat-card-peach">
        <span className="stat-label">累計支出</span>
        <span className="stat-value">¥{fmt.format(allTotal)}</span>
      </div>
      <div className="stat-card stat-card-lavender">
        <span className="stat-label">記録件数</span>
        <span className="stat-value">{expenses.length}<small style={{ fontSize: '16px', marginLeft: '4px', opacity: 0.7 }}>件</small></span>
      </div>
    </div>
  )
}
