type Props = {
  dataType: string
  deleteCount: number
  onDeleteOld: () => void
  onCancel: () => void
}

export default function StorageQuotaDialog({ dataType, deleteCount, onDeleteOld, onCancel }: Props) {
  return (
    <div className="quota-overlay" onClick={onCancel}>
      <div className="quota-dialog" onClick={e => e.stopPropagation()}>
        <div className="quota-icon">!</div>
        <h2 className="quota-title">保存領域が不足しています</h2>
        <p className="quota-body">
          ブラウザの保存容量が上限に達したため、<strong>{dataType}</strong>を保存できませんでした。
        </p>
        <p className="quota-body">
          古い{dataType}データを最大 <strong>{deleteCount}件</strong> 削除して保存しますか？
          <br />
          （削除されるのは日付が最も古いものから順番です）
        </p>
        <div className="quota-actions">
          <button className="quota-btn quota-btn--cancel" onClick={onCancel}>
            キャンセル（保存しない）
          </button>
          <button className="quota-btn quota-btn--delete" onClick={onDeleteOld}>
            古いデータを削除して保存
          </button>
        </div>
      </div>
    </div>
  )
}
