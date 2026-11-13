import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useGrocery } from '../context/groceryStore'
import { useTheme } from '../context/themeStore'
import ChangePasswordForm from '../components/ChangePasswordForm'
import ConfirmDialog from '../components/ConfirmDialog'

const roleLabels = {
  ADMIN: 'Admin',
  STAFF: 'Staff',
  CUSTOMER: 'Customer',
}

function Section({ title, children }) {
  return (
    <section className="mt-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  )
}

function SettingPage() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { syncNow, countUnsynced, clearLocalData } = useGrocery()
  const [waiting, setWaiting] = useState(0)
  const [busy, setBusy] = useState(false)

  const dark = theme === 'dark'

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
    <div className="p-4 pb-8">
      <h1 className="text-3xl font-bold text-orange-600">Setting</h1>

      <Section title="Profile">
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Name</dt>
            <dd className="font-bold">{user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Username</dt>
            <dd className="font-bold">{user.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Role</dt>
            <dd className="font-bold">{roleLabels[user.role] ?? user.role}</dd>
          </div>
        </dl>
      </Section>

      {user.role === 'ADMIN' && (
        <Section title="Administration">
          <Link
            to="/users"
            className="flex items-center justify-between rounded-lg border border-gray-300 px-4 py-3 font-bold dark:border-gray-600"
          >
            <span>Manage users</span>
            <span className="text-orange-600 dark:text-orange-400">›</span>
          </Link>
        </Section>
      )}

      <Section title="Appearance">
        <div className="flex items-center justify-between">
          <span>Dark mode</span>
          <button
            type="button"
            role="switch"
            aria-checked={dark}
            aria-label="Dark mode"
            onClick={toggleTheme}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              dark ? 'bg-orange-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                dark ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </Section>

      <Section title="Change password">
        <ChangePasswordForm username={user.username} />
      </Section>

      <button
        type="button"
        onClick={handleLogout}
        disabled={busy}
        className="mt-6 w-full rounded-lg border border-red-300 py-3 font-bold text-red-600 disabled:opacity-50 dark:border-red-800 dark:text-red-400"
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