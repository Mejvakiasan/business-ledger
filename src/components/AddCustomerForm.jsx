import { useState } from 'react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const inputStyle =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800'

function AddCustomerForm({ onSave, onClose }) {
  const online = useOnlineStatus()
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim()) return setError('Name is required')
    if (mobile && !/^\d{10}$/.test(mobile)) {
      return setError('Mobile number must be 10 digits')
    }
    if (!(Number(amount) > 0)) {
      return setError('Enter an amount greater than 0')
    }

    setSaving(true)
    try {
      await onSave({ name, mobile, amount })
    } catch {
      setError('Could not save. Check your internet and try again.')
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
        <h2 className="mb-4 text-xl font-bold text-orange-600">New customer</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input
              className={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Ravi"
            />
          </div>

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

          <div>
            <label className="mb-1 block text-sm">Amount (₹)</label>
            <input
              className={inputStyle}
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="First amount"
            />
          </div>

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

export default AddCustomerForm