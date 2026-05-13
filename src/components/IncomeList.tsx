import type { Income, IncomeCategory } from '../types'

interface Props {
  incomes: Income[]
  incomeCategories: IncomeCategory[]
  onDelete: (id: string) => void
}

const fmt = new Intl.NumberFormat('ja-JP')

function formatDate(d: string) {
  const [y, m, day] = d.split('-')
  return `${y}/${m}/${day}`
}

export default function IncomeList({ incomes, incomeCategories, onDelete }: Props) {
  const sorted = [...incomes].sort((a, b) => b.date.localeCompare(a.date))
  const catMap = Object.fromEntries(incomeCategories.map((c) => [c.id, c]))

  return (
    <section className="card">
      <h2 className="card-title">収入一覧</h2>
      {sorted.length === 0 ? (
        <p className="empty-hint">まだ記録がありません</p>
      ) : (
        <ul className="expense-list">
          {sorted.map((inc) => {
            const cat = catMap[inc.incomeCategoryId]
            return (
              <li key={inc.id} className="expense-item">
                <span className="expense-date">{formatDate(inc.date)}</span>
                <span className="expense-category">
                  {cat && (
                    <span
                      className="category-dot"
                      style={{ backgroundColor: cat.color }}
                    />
                  )}
                  {cat?.name ?? '不明'}
                </span>
                <span className="expense-memo">{inc.memo}</span>
                <span className="expense-amount income-amount">+¥{fmt.format(inc.amount)}</span>
                <button
                  className="btn-icon btn-icon--danger"
                  onClick={() => onDelete(inc.id)}
                  aria-label="削除"
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
