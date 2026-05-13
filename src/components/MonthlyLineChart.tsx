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
import { getFiscalYear, getCurrentFiscalYear, getFiscalYearMonths } from '../utils/fiscalYear'

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

  const fyMonths = getFiscalYearMonths(selectedFY)
  const fyMonthSet = new Set(fyMonths)

  const monthlyExpense: Record<string, number> = {}
  const monthlyIncome: Record<string, number> = {}
  for (const m of fyMonths) { monthlyExpense[m] = 0; monthlyIncome[m] = 0 }

  for (const exp of expenses) {
    const m = exp.date.slice(0, 7)
    if (fyMonthSet.has(m)) monthlyExpense[m] += exp.amount
  }
  for (const inc of incomes) {
    const m = inc.date.slice(0, 7)
    if (fyMonthSet.has(m)) monthlyIncome[m] += inc.amount
  }

  const hasData = fyMonths.some(m => monthlyExpense[m] > 0 || monthlyIncome[m] > 0)

  const data = fyMonths.map((month) => {
    const [y, mo] = month.split('-')
    return { label: `${y}/${mo}`, 支出: monthlyExpense[month], 収入: monthlyIncome[month] }
  })

  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">月次収支推移</h2>
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
              formatter={(value, name) => [`¥${fmt.format(Number(value))}`, name === '支出' ? '支出合計' : '収入合計']}
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
            <Line
              type="monotone"
              dataKey="収入"
              stroke="#3A7BD5"
              strokeWidth={2.5}
              dot={{ fill: '#3A7BD5', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#3A7BD5', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
