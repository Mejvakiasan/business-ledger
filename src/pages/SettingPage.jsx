import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useGrocery } from '../context/groceryStore'
import ConfirmDialog from '../components/ConfirmDialog'

function SettingPage() {
  const { user, logout } = useAuth()
  const { syncNow, countUnsynced, clearLocalData } = useGrocery()
  const [waiting, setWaiting] = useState(0)
  const [busy, setBusy] = useState(false)

  async function finishLogout() {
    try {
      await clearLocalData()
    } catch (error) {
      console.error('Could not clear saved data', error)
    } finally {
      logout()
    }
  }

  async function handleLogout() {
    setBusy(true)
    await syncNow()
    const count = await countUnsynced()
    if (count > 0) {
      setWaiting(count)
      setBusy(false)
      return
    }
    await finishLogout()
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-3xl font-bold text-orange-600">Setting Page</h1>
      <p>Name: {user?.name}</p>
      <p>Username: {user?.username}</p>
      <p>Role: {user?.role}</p>

      <button
        type="button"
        onClick={handleLogout}
        disabled={busy}
        className="mt-4 rounded-lg bg-orange-600 px-4 py-2 font-bold text-white disabled:opacity-50"
      >
        {busy ? 'Please wait...' : 'Logout'}
      </button>

      {waiting > 0 && (
        <ConfirmDialog
          title="Not synced yet"
          message={`${waiting} ${waiting === 1 ? 'purchase is' : 'purchases are'} still waiting to sync. If you log out now, ${waiting === 1 ? 'it' : 'they'} will be deleted from this phone. Connect to the internet and wait for the sync first.`}
          confirmLabel="Log out anyway"
          danger
          onConfirm={finishLogout}
          onCancel={() => setWaiting(0)}
        />
      )}
    </div>
  )
}

export default SettingPage