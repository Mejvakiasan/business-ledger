import { useState, useEffect } from 'react'
import { listFreeCustomers } from '../api/users'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const inputStyle =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800'

const errorMessages = {
  USERNAME_TAKEN: 'That username is already taken',
  CUSTOMER_REQUIRED: 'Choose the customer this login belongs to',
  FORBIDDEN: 'You are not allowed to do that',
}

function UserForm({ user, actor, onSave, onClose }) {
  const online = useOnlineStatus()
  const editing = Boolean(user)
  const isSelf = editing && user.id === actor.id

  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState(user?.mobile ?? '')
  const [role, setRole] = useState('STAFF')
  const [customerId, setCustomerId] = useState('')
  const [customers, setCustomers] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editing) return
    let cancelled = false
    listFreeCustomers()
      .then((data) => {
        if (!cancelled) setCustomers(data)
      })
      .catch(() => {
        if (!cancelled) setCustomers([])
      })
    return () => {
      cancelled = true
    }
  }, [editing])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim()) return setError('Name is required')
    if (!/^[a-z0-9_.]{3,20}$/i.test(username.trim())) {
      return setError('Username: 3 to 20 letters, numbers, dot or underscore')
    }
    if (!editing && password.length < 8) {
      return setError('Password must be at least 8 characters')
    }
    if (mobile && !/^\d{10}$/.test(mobile)) {
      return setError('Mobile number must be 10 digits')
    }
    if (!editing && role === 'CUSTOMER' && !customerId) {
      return setError('Choose the customer this login belongs to')
    }

    setSaving(true)
    try {
      await onSave({ name, username, password, mobile, role, customerId })
    } catch (err) {
      setError(
        errorMessages[err.message] ??
          'Could not save. Check your internet and try again.'
      )
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 pb-8 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold text-orange-600">
          {editing ? 'Edit user' : 'New user'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!editing && (
            <div>
              <label className="mb-1 block text-sm">Role</label>
              <select
                className={inputStyle}
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  setError('')
                }}
              >
                <option value="STAFF">Staff</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input
              className={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Username</label>
            <input
              className={inputStyle}
              value={username}
              disabled={isSelf}
              autoCapitalize="none"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {!editing && (
            <div>
              <label className="mb-1 block text-sm">Temporary password</label>
              <input
                className={inputStyle}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tell the person this password. They should change it after
                logging in.
              </p>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm">Mobile number (optional)</label>
            <input
              className={inputStyle}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="10 digits"
            />
          </div>

          {!editing && role === 'CUSTOMER' && (
            <div>
              <label className="mb-1 block text-sm">Customer record</label>
              <select
                className={inputStyle}
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">
                  {customers === null ? 'Loading...' : 'Choose a customer'}
                </option>
                {(customers ?? []).map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                    {customer.mobile ? ` (${customer.mobile})` : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                The person will see only this customer&apos;s account.
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {!online && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Internet needed to save.
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-3 font-bold dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !online}
              className="flex-1 rounded-lg bg-orange-600 py-3 font-bold text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm