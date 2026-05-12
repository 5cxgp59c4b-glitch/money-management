import type { Category, Expense } from '../types'

interface Props {
  expenses: Expense[]
  categories: Category[]
  onDelete: (id: string) => void
}

const fmt = new Intl.NumberFormat('ja-JP')

function formatDate(d: string) {
  const [y, m, day] = d.split('-')
  return `${y}/${m}/${day}`
}

export default function ExpenseList({ expenses, categories, onDelete }: Props) {
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date))
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]))

  return (
    <section className="card">
      <h2 className="card-title">支出一覧</h2>
      {sorted.length === 0 ? (
        <p className="empty-hint">まだ記録がありません</p>
      ) : (
        <ul className="expense-list">
          {sorted.map((exp) => {
            const cat = catMap[exp.categoryId]
            return (
              <li key={exp.id} className="expense-item">
                <span className="expense-date">{formatDate(exp.date)}</span>
                <span className="expense-category">
                  {cat && (
                    <span
                      className="category-dot"
                      style={{ backgroundColor: cat.color }}
                    />
                  )}
                  {cat?.name ?? '不明'}
                </span>
                <span className="expense-memo">{exp.memo}</span>
                <span className="expense-amount">¥{fmt.format(exp.amount)}</span>
                <button
                  className="btn-icon btn-icon--danger"
                  onClick={() => onDelete(exp.id)}
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
