import { useOnlineStatus } from '../hooks/useOnlineStatus'

function OfflineBanner() {
  const online = useOnlineStatus()

  if (online) return null

  return (
    <div className="bg-gray-800 px-4 py-2 text-center text-sm font-medium text-white dark:bg-gray-200 dark:text-gray-900">
      You are offline. Grocery still works.
    </div>
  )
}

export default OfflineBanner