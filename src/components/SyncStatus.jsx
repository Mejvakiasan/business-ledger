import { useGrocery } from '../context/groceryStore'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

function SyncStatus() {
  const { unsyncedCount, syncNow } = useGrocery()
  const online = useOnlineStatus()

  if (unsyncedCount === 0) return null

  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm dark:border-amber-700 dark:bg-amber-950/40">
      <span>
        {unsyncedCount} waiting to sync{!online && ' (offline)'}
      </span>
      <button
        type="button"
        onClick={() => syncNow()}
        disabled={!online}
        className="rounded-lg bg-orange-600 px-3 py-1 font-bold text-white disabled:opacity-40"
      >
        Sync now
      </button>
    </div>
  )
}

export default SyncStatus