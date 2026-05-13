import { useState } from 'react'
import type { Income, IncomeCategory } from '../types'

interface Props {
  incomeCategories: IncomeCategory[]
  onAdd: (income: Income) => void
}

export default function IncomeForm({ incomeCategories, onAdd }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [incomeCategoryId, setIncomeCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!incomeCategoryId || !amount || Number(amount) <= 0) return
    onAdd({
      id: crypto.randomUUID(),
      incomeCategoryId,
      amount: Number(amount),
      date,
      memo: memo.trim(),
    })
    setAmount('')
    setMemo('')
  }

  return (
    <section className="card">
      <h2 className="card-title">収入を記録</h2>
      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="label">日付</label>
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label className="label">カテゴリ</label>
          <select
            className="input"
            value={incomeCategoryId}
            onChange={(e) => setIncomeCategoryId(e.target.value)}
            required
          >
            <option value="">選択してください</option>
            {incomeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="label">金額（円）</label>
          <input
            className="input"
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="form-row">
          <label className="label">メモ</label>
          <input
            className="input"
            type="text"
            placeholder="任意"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={50}
          />
        </div>

        <button
          className="btn btn--primary btn--full"
          type="submit"
          disabled={!incomeCategoryId || !amount || Number(amount) <= 0}
        >
          記録する
        </button>
      </form>
    </section>
  )
}
