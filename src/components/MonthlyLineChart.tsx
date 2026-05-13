import { useState } from 'react'
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
import { getFiscalYear, getCurrentFiscalYear } from '../utils/fiscalYear'

interface Props {
  expenses: Expense[]
  incomes: Income[]
}

const fmt = new Intl.NumberFormat('ja-JP')

export default function MonthlyLineChart({ expenses, incomes }: Props) {
  const currentFY = getCurrentFiscalYear()
  const [selectedFY, setSelectedFY] = useState(currentFY)

  const allFYs = Array.from(new Set([
    ...expenses.map(e => getFiscalYear(e.date)),
    ...incomes.map(i => getFiscalYear(i.date)),
  ]))
  const availableFYs = Array.from(new Set([currentFY, ...allFYs])).sort((a, b) => b - a)

  const fyExpenses = expenses
    .filter(e => getFiscalYear(e.date) === selectedFY)
    .sort((a, b) => a.date.localeCompare(b.date))

  const hasData = fyExpenses.length > 0

  const data = fyExpenses.map((exp) => {
    const [, mo, d] = exp.date.split('-')
    return { label: `${mo}/${d}`, 支出: exp.amount }
  })

  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">{selectedFY}年度 支出推移</h2>
        <select
          className="input fy-select"
          value={selectedFY}
          onChange={(e) => setSelectedFY(Number(e.target.value))}
        >
          {availableFYs.map(fy => (
            <option key={fy} value={fy}>{fy}年度</option>
          ))}
        </select>
      </div>
      {!hasData ? (
        <p className="empty-hint">データがありません</p>
      ) : (
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
              formatter={(value) => [`¥${fmt.format(Number(value))}`, '支出']}
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
              stroke="#C84B2F"
              strokeWidth={2.5}
              dot={{ fill: '#C84B2F', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#C84B2F', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
