import { useState } from 'react'
import { changePassword } from '../api/auth'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const inputStyle =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800'

function ChangePasswordForm({ username }) {
  const online = useOnlineStatus()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  function edit(setter) {
    return (e) => {
      setter(e.target.value)
      setError('')
      setSuccess(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSuccess(false)

    if (!current) return setError('Enter your current password')
    if (next.length < 8) {
      return setError('New password must be at least 8 characters')
    }
    if (next === current) {
      return setError('New password must be different from the current one')
    }
    if (next !== confirm) return setError('The new passwords do not match')

    setSaving(true)
    try {
      await changePassword(username, current, next)
      setCurrent('')
      setNext('')
      setConfirm('')
      setSuccess(true)
    } catch (err) {
      setError(
        err.message === 'WRONG_PASSWORD'
          ? 'Current password is incorrect'
          : 'Could not change the password. Check your internet and try again.'
      )
    }
    setSaving(false)
  }

  const type = show ? 'text' : 'password'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm">Current password</label>
        <input
          className={inputStyle}
          type={type}
          autoComplete="current-password"
          value={current}
          onChange={edit(setCurrent)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm">New password</label>
        <input
          className={inputStyle}
          type={type}
          autoComplete="new-password"
          value={next}
          onChange={edit(setNext)}
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm">Repeat new password</label>
        <input
          className={inputStyle}
          type={type}
          autoComplete="new-password"
          value={confirm}
          onChange={edit(setConfirm)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={show}
          onChange={(e) => setShow(e.target.checked)}
        />
        Show passwords
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-green-700 dark:text-green-400">
          Password changed.
        </p>
      )}
      {!online && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Internet needed to change the password.
        </p>
      )}

      <button
        type="submit"
        disabled={saving || !online}
        className="w-full rounded-lg bg-orange-600 py-3 font-bold text-white disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Change password'}
      </button>
    </form>
  )
}

export default ChangePasswordForm