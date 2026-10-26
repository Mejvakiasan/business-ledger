import { useState } from 'react'
import HistoryCard from './HistoryCard'
import ConfirmDialog from './ConfirmDialog'
import { formatDateTime } from '../utils/grocery'

function HistoryList({ history, canDelete, onDelete }) {
  const [deleting, setDeleting] = useState(null)

  if (history.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
        No purchases yet. Completed shopping trips appear here.
      </p>
    )
  }

  return (
    <>
      <div className="mt-4 space-y-3">
        {history.map((record) => (
          <HistoryCard
            key={record.id}
            record={record}
            canDelete={canDelete}
            onDelete={setDeleting}
          />
        ))}
      </div>

      {deleting && (
        <ConfirmDialog
          title="Delete this record?"
          message={`The purchase from ${formatDateTime(deleting.completedAt)} will be removed from history. This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            onDelete(deleting.id)
            setDeleting(null)
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}

export default HistoryList