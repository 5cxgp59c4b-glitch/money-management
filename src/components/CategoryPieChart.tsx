import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Category, Expense } from '../types'

interface Props {
  expenses: Expense[]
  categories: Category[]
}

const fmt = new Intl.NumberFormat('ja-JP')

export default function CategoryPieChart({ expenses, categories }: Props) {
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]))

  const totals: Record<string, number> = {}
  for (const exp of expenses) {
    totals[exp.categoryId] = (totals[exp.categoryId] ?? 0) + exp.amount
  }

  const data = Object.entries(totals)
    .map(([id, value]) => ({ name: catMap[id]?.name ?? '不明', value, color: catMap[id]?.color ?? '#999' }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <section className="card">
        <h2 className="card-title">カテゴリ別割合</h2>
        <p className="empty-hint">データがありません</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2 className="card-title">カテゴリ別割合</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`¥${fmt.format(Number(value))}`, '金額']}
            contentStyle={{
              border: '1.5px solid #e5e5e5',
              borderRadius: '12px',
              fontSize: '13px',
              background: '#fffaf0',
              boxShadow: 'none',
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: '13px', color: '#3a3a3a', fontFamily: 'Noto Sans JP, sans-serif' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </section>
  )
}
