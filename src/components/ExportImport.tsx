import { useRef } from 'react'
import type { Category, Expense } from '../types'

interface Props {
  categories: Category[]
  expenses: Expense[]
  onImport: (categories: Category[], expenses: Expense[]) => void
}

interface JsonBackup {
  version: number
  exportedAt: string
  categories: Category[]
  expenses: Expense[]
}

const fmt = new Intl.NumberFormat('ja-JP')

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function todayStr() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '')
}

export default function ExportImport({ categories, expenses, onImport }: Props) {
  const jsonInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)

  // ── エクスポート ───────────────────────────────────
  const exportJson = () => {
    const backup: JsonBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      categories,
      expenses,
    }
    downloadFile(JSON.stringify(backup, null, 2), `支出管理_${todayStr()}.json`, 'application/json')
  }

  const exportCsv = () => {
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))
    const header = '日付,カテゴリ,金額,メモ'
    const rows = [...expenses]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((e) =>
        [
          e.date,
          catMap[e.categoryId] ?? '',
          e.amount,
          `"${e.memo.replace(/"/g, '""')}"`,
        ].join(',')
      )
    const csv = '﻿' + [header, ...rows].join('\n')
    downloadFile(csv, `支出管理_${todayStr()}.csv`, 'text/csv;charset=utf-8')
  }

  // ── インポート ─────────────────────────────────────
  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as JsonBackup
        if (!data.categories || !data.expenses) throw new Error('形式が不正です')
        if (!window.confirm(`${data.expenses.length} 件のデータをインポートします。現在のデータは上書きされます。よろしいですか？`)) return
        onImport(data.categories, data.expenses)
      } catch {
        alert('JSONファイルの読み込みに失敗しました。')
      } finally {
        e.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  const importCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = (ev.target?.result as string).replace(/^﻿/, '')
        const lines = text.split('\n').filter(Boolean)
        const dataLines = lines.slice(1)

        const catNameMap = Object.fromEntries(categories.map((c) => [c.name, c.id]))
        const newExpenses: Expense[] = []
        const unknownCats: string[] = []

        for (const line of dataLines) {
          const cols = parseCsvLine(line)
          const [date, catName, amountStr, memo] = cols
          if (!date || !catName || !amountStr) continue
          const amount = Number(amountStr)
          if (isNaN(amount) || amount <= 0) continue
          const categoryId = catNameMap[catName]
          if (!categoryId) {
            if (!unknownCats.includes(catName)) unknownCats.push(catName)
            continue
          }
          newExpenses.push({
            id: crypto.randomUUID(),
            categoryId,
            amount,
            date,
            memo: memo ?? '',
          })
        }

        if (unknownCats.length > 0) {
          alert(`以下のカテゴリが見つからなかったためスキップしました:\n${unknownCats.join(', ')}\n\nまずカテゴリを追加してから再インポートしてください。`)
        }

        if (newExpenses.length === 0) {
          alert('インポートできるデータがありませんでした。')
          return
        }

        if (!window.confirm(`${newExpenses.length} 件を追加インポートします。よろしいですか？`)) return
        onImport(categories, [...expenses, ...newExpenses])
      } catch {
        alert('CSVファイルの読み込みに失敗しました。')
      } finally {
        e.target.value = ''
      }
    }
    reader.readAsText(file, 'UTF-8')
  }

  const totalAmount = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <section className="card">
      <h2 className="card-title">データ管理</h2>

      <div className="data-info">
        <span className="data-info-item">
          <span className="data-info-label">記録件数</span>
          <span className="data-info-value">{expenses.length} 件</span>
        </span>
        <span className="data-info-item">
          <span className="data-info-label">累計</span>
          <span className="data-info-value">¥{fmt.format(totalAmount)}</span>
        </span>
      </div>

      <div className="io-section">
        <p className="io-section-title">エクスポート</p>
        <div className="io-buttons">
          <button className="btn btn--outline" onClick={exportJson} disabled={expenses.length === 0}>
            JSON でダウンロード
          </button>
          <button className="btn btn--outline" onClick={exportCsv} disabled={expenses.length === 0}>
            CSV でダウンロード
          </button>
        </div>
      </div>

      <div className="io-section">
        <p className="io-section-title">インポート</p>
        <div className="io-buttons">
          <button className="btn btn--outline" onClick={() => jsonInputRef.current?.click()}>
            JSON から復元
          </button>
          <button className="btn btn--outline" onClick={() => csvInputRef.current?.click()}>
            CSV から追加
          </button>
        </div>
        <p className="io-hint">JSON: 全データを上書き復元 / CSV: 支出データを追加</p>
        <input ref={jsonInputRef} type="file" accept=".json" onChange={importJson} style={{ display: 'none' }} />
        <input ref={csvInputRef} type="file" accept=".csv" onChange={importCsv} style={{ display: 'none' }} />
      </div>
    </section>
  )
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let cur = ''
  let inQuote = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++ }
      else inQuote = !inQuote
    } else if (ch === ',' && !inQuote) {
      result.push(cur); cur = ''
    } else {
      cur += ch
    }
  }
  result.push(cur)
  return result
}
