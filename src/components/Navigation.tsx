import type { TabType } from '../types'

interface Props {
  active: TabType
  onChange: (tab: TabType) => void
}

export default function Navigation({ active, onChange }: Props) {
  return (
    <nav className="nav">
      <button
        className={`nav-tab${active === 'record' ? ' nav-tab--active' : ''}`}
        onClick={() => onChange('record')}
      >
        記録
      </button>
      <button
        className={`nav-tab${active === 'analytics' ? ' nav-tab--active' : ''}`}
        onClick={() => onChange('analytics')}
      >
        分析
      </button>
    </nav>
  )
}
