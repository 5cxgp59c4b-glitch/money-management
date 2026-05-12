import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Expense } from '../types'

interface Props {
  expenses: Expense[]
}

const fmt = new Intl.NumberFormat('ja-JP')

export default function MonthlyLineChart({ expenses }: Props) {
  const monthly: Record<string, number> = {}
  for (const exp of expenses) {
    const month = exp.date.slice(0, 7)
    monthly[month] = (monthly[month] ?? 0) + exp.amount
  }

  const data = Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => {
      const [y, m] = month.split('-')
      return { label: `${y}/${m}`, total }
    })

  if (data.length === 0) {
    return (
      <section className="card">
        <h2 className="card-title">月別支出推移</h2>
        <p className="empty-hint">データがありません</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2 className="card-title">月別支出推移</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E2DA" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#6B6560' }}
            axisLine={{ stroke: '#E8E2DA' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `¥${fmt.format(v)}`}
            tick={{ fontSize: 11, fill: '#6B6560' }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value) => [`¥${fmt.format(Number(value))}`, '支出合計']}
            contentStyle={{
              border: '1px solid #E8E2DA',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#C84B2F"
            strokeWidth={2.5}
            dot={{ fill: '#C84B2F', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}
