import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Expense, Income } from '../types'

interface Props {
  expenses: Expense[]
  incomes: Income[]
}

const fmt = new Intl.NumberFormat('ja-JP')

export default function MonthlyLineChart({ expenses, incomes }: Props) {
  const monthsSet = new Set<string>()
  for (const exp of expenses) monthsSet.add(exp.date.slice(0, 7))
  for (const inc of incomes) monthsSet.add(inc.date.slice(0, 7))

  const months = Array.from(monthsSet).sort()

  if (months.length === 0) {
    return (
      <section className="card">
        <h2 className="card-title">月別支出推移</h2>
        <p className="empty-hint">データがありません</p>
      </section>
    )
  }

  const monthlyExpense: Record<string, number> = {}
  for (const m of months) monthlyExpense[m] = 0
  for (const exp of expenses) monthlyExpense[exp.date.slice(0, 7)] += exp.amount

  const data = months.map((month) => {
    const [y, m] = month.split('-')
    return { label: `${y}/${m}`, 支出: monthlyExpense[month] }
  })

  return (
    <section className="card">
      <h2 className="card-title">月別支出推移</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebe6d6" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#6a6a6a', fontFamily: 'Noto Sans JP, sans-serif' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `¥${fmt.format(v)}`}
            tick={{ fontSize: 11, fill: '#6a6a6a', fontFamily: 'Noto Sans JP, sans-serif' }}
            axisLine={false}
            tickLine={false}
            width={82}
          />
          <Tooltip
            formatter={(value) => [`¥${fmt.format(Number(value))}`, '支出合計']}
            contentStyle={{
              border: '1.5px solid #e5e5e5',
              borderRadius: '12px',
              fontSize: '13px',
              background: '#fffaf0',
              boxShadow: 'none',
            }}
          />
          <Line
            type="monotone"
            dataKey="支出"
            stroke="#1a3a3a"
            strokeWidth={2.5}
            dot={{ fill: '#1a3a3a', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#1a3a3a', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}
