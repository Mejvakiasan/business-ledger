import { useState, useEffect } from 'react'
import { getDayEntries, addEntry } from '../api/account'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { formatMoney } from '../utils/grocery'
import { toDateKey, formatTime, formatDayLabel } from '../utils/dates'

function CustomerCard({ customer, canAdd, onChanged, defaultOpen = false }) {
  const online = useOnlineStatus()
  const [open, setOpen] = useState(defaultOpen)
  const [day, setDay] = useState(null)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  const [amount, setAmount] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false

    getDayEntries(customer.id, toDateKey(new Date()))
      .then((data) => {
        if (cancelled) return
        setDay(data)
        setError('')
      })
      .catch(() => {
        if (!cancelled) setError('Needs internet. Connect and try again.')
      })

    return () => {
      cancelled = true
    }
  }, [open, customer.id, version])

  async function handleAdd(e) {
    e.preventDefault()
    if (!(Number(amount) > 0)) {
      setFormError('Enter an amount greater than 0')
      return
    }

    setSaving(true)
    try {
      await addEntry(customer.id, amount)
      setAmount('')
      setFormError('')
      setVersion((count) => count + 1)
      if (onChanged) onChanged()
    } catch {
      setFormError('Could not save. Check your internet and try again.')
    }
    setSaving(false)
  }

  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="min-w-0">
          <span className="block truncate font-bold">{customer.name}</span>
          {customer.mobile && (
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {customer.mobile}
            </span>
          )}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
            {formatMoney(customer.total)}
          </span>
          <span
            className={`text-orange-600 transition-transform dark:text-orange-400 ${
              open ? 'rotate-180' : ''
            }`}
          >
            ▼
          </span>
        </span>
      </button>

      {open && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-700">
          <p className="text-sm font-bold">
            Today, {formatDayLabel(new Date())}
          </p>

          {error && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>
          )}

          {!error && day === null && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          )}

          {!error && day !== null && (
            <>
              {day.entries.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No entries today
                </p>
              ) : (
                <ul className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                  {day.entries.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(entry.entryTime)}
                      </span>
                      <span className="font-bold">{formatMoney(entry.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                <span className="font-bold">Today&apos;s total</span>
                <span className="text-lg font-extrabold text-orange-600 dark:text-orange-400">
                  {formatMoney(day.total)}
                </span>
              </div>
            </>
          )}

          {canAdd && (
            <form onSubmit={handleAdd} className="mt-4">
              <label className="mb-1 block text-sm">New amount (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setFormError('')
                  }}
                  placeholder="Example: 25"
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800"
                />
                <button
                  type="submit"
                  disabled={saving || !online}
                  className="rounded-lg bg-orange-600 px-5 font-bold text-white disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add'}
                </button>
              </div>
              {formError && (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              )}
              {!online && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Internet needed to save.
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                The date and time are saved automatically.
              </p>
            </form>
          )}
        </div>
      )}
    </section>
  )
}

export default CustomerCard