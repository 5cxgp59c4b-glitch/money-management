import { useState, useEffect } from 'react'
import { getCurrentFiscalYear } from '../utils/fiscalYear'

interface Props {
  openingBalance: number
  onSave: (amount: number) => void
}

const fmt = new Intl.NumberFormat('ja-JP')

export default function FiscalYearBalanceForm({ openingBalance, onSave }: Props) {
  const fy = getCurrentFiscalYear()
  const [value, setValue] = useState(openingBalance === 0 ? '' : String(openingBalance))

  useEffect(() => {
    setValue(openingBalance === 0 ? '' : String(openingBalance))
  }, [openingBalance])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(Number(value) || 0)
  }

  return (
    <section className="card">
      <h2 className="card-title">{fy}年度 年初残高設定</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="label">{fy}年4月1日時点の残高</label>
          <div className="opening-balance-input-row">
            <input
              type="number"
              className="input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0"
              min="0"
            />
            <button type="submit" className="btn btn--primary" style={{ flexShrink: 0 }}>設定</button>
          </div>
        </div>
        {openingBalance > 0 && (
          <p className="opening-balance-hint">
            設定済み：¥{fmt.format(openingBalance)}　→　今月の使用可能額：¥{fmt.format(Math.floor(openingBalance / 12))}
          </p>
        )}
      </form>
    </section>
  )
}
