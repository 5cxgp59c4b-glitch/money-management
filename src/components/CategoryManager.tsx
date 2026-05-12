import { useState } from 'react'
import type { Category } from '../types'

const PRESET_COLORS = [
  '#C84B2F', '#D4823A', '#C9B53A', '#5BAD6B',
  '#3A7BD5', '#7C5BD5', '#D55B8A', '#5BA8D5',
]

interface Props {
  categories: Category[]
  onAdd: (category: Category) => void
  onDelete: (id: string) => void
}

export default function CategoryManager({ categories, onAdd, onDelete }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
    })
    setName('')
  }

  return (
    <section className="card">
      <h2 className="card-title">カテゴリ管理</h2>

      <div className="category-form">
        <input
          className="input"
          type="text"
          placeholder="カテゴリ名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          maxLength={20}
        />
        <div className="color-picker">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              className={`color-dot${color === c ? ' color-dot--selected' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              aria-label={c}
            />
          ))}
        </div>
        <button className="btn btn--primary" onClick={handleAdd} disabled={!name.trim()}>
          追加
        </button>
      </div>

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id} className="category-item">
            <span className="category-dot" style={{ backgroundColor: cat.color }} />
            <span className="category-name">{cat.name}</span>
            <button
              className="btn-icon btn-icon--danger"
              onClick={() => onDelete(cat.id)}
              aria-label="削除"
            >
              ✕
            </button>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="empty-hint">カテゴリがありません</li>
        )}
      </ul>
    </section>
  )
}
