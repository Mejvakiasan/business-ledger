import { useState, useEffect } from 'react'
import {
  getDayEntries,
  addEntry,
  updateEntry,
  deleteEntry,
} from '../api/account'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { formatMoney } from '../utils/grocery'
import { toDateKey, fromDateKey, formatTime, formatDayLabel } from '../utils/dates'
import MonthCalendar from './MonthCalendar'
import ConfirmDialog from './ConfirmDialog'

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function CustomerCard({
  customer,
  canAdd,
  isAdmin = false,
  onChanged,
  onEdit,
  onDelete,
  defaultOpen = false,
}) {
  const online = useOnlineStatus()
  const todayKey = toDateKey(new Date())

  const [open, setOpen] = useState(defaultOpen)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState(todayKey)
  const [day, setDay] = useState(null)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  const [amount, setAmount] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editAmount, setEditAmount] = useState('')
  const [deletingEntry, setDeletingEntry] = useState(null)
  const [entryBusy, setEntryBusy] = useState(false)
  const [entryError, setEntryError] = useState('')

  useEffect(() => {
    if (!open) return
    let cancelled = false

    getDayEntries(customer.id, selectedKey)
      .then((data) => {
        if (cancelled) return
        setDay({ key: selectedKey, ...data })
        setError('')
      })
      .catch(() => {
        if (!cancelled) setError('Needs internet. Connect and try again.')
      })

    return () => {
      cancelled = true
    }
  }, [open, customer.id, selectedKey, version])

  function toggleCalendar() {
    if (calendarOpen) setSelectedKey(todayKey)
    setCalendarOpen(!calendarOpen)
  }

  function refresh() {
    setVersion((count) => count + 1)
    if (onChanged) onChanged()
  }

  function startEdit(entry) {
    setEditingId(entry.id)
    setEditAmount(String(entry.amount))
    setEntryError('')
  }

  async function saveEntry(entry) {
    if (!(Number(editAmount) > 0)) {
      setEntryError('Enter an amount greater than 0')
      return
    }
    setEntryBusy(true)
    try {
      await updateEntry(entry.id, editAmount)
      setEditingId(null)
      setEntryError('')
      refresh()
    } catch {
      setEntryError('Could not save. Check your internet and try again.')
    }
    setEntryBusy(false)
  }

  async function confirmDeleteEntry() {
    setEntryBusy(true)
    try {
      await deleteEntry(deletingEntry.id)
      setDeletingEntry(null)
      setEntryError('')
      refresh()
    } catch {
      setDeletingEntry(null)
      setEntryError('Could not delete. Check your internet and try again.')
    }
    setEntryBusy(false)
  }

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
      setSelectedKey(todayKey)
      setVersion((count) => count + 1)
      if (onChanged) onChanged()
    } catch {
      setFormError('Could not save. Check your internet and try again.')
    }
    setSaving(false)
  }

  const isToday = selectedKey === todayKey
  const dayLabel = formatDayLabel(fromDateKey(selectedKey))
  const dayLoaded = day !== null && day.key === selectedKey

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
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">
              {isToday ? `Today, ${dayLabel}` : dayLabel}
            </p>
            <button
              type="button"
              onClick={toggleCalendar}
              aria-label={calendarOpen ? 'Hide calendar' : 'Show calendar'}
              aria-expanded={calendarOpen}
              className={`rounded-lg border p-2 ${
                calendarOpen
                  ? 'border-orange-600 bg-orange-50 text-orange-600 dark:bg-orange-950'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <CalendarIcon />
            </button>
          </div>

          {calendarOpen && (
            <MonthCalendar
              customerId={customer.id}
              selectedKey={selectedKey}
              todayKey={todayKey}
              version={version}
              onSelect={setSelectedKey}
            />
          )}

          {error && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>
          )}

          {!error && !dayLoaded && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          )}

          {!error && dayLoaded && (
            <>
              {day.entries.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isToday ? 'No entries today' : 'No entries'}
                </p>
              ) : (
                <ul className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                  {day.entries.map((entry) =>
                    editingId === entry.id ? (
                      <li key={entry.id} className="flex items-center gap-2 py-2">
                        <input
                          type="number"
                          inputMode="decimal"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          aria-label="Amount"
                          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                        />
                        <button
                          type="button"
                          onClick={() => saveEntry(entry)}
                          disabled={entryBusy}
                          className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold dark:border-gray-600"
                        >
                          Cancel
                        </button>
                      </li>
                    ) : (
                      <li
                        key={entry.id}
                        className="flex items-center justify-between gap-2 py-2"
                      >
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(entry.entryTime)}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="font-bold">
                            {formatMoney(entry.amount)}
                          </span>
                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => startEdit(entry)}
                                className="text-sm font-bold text-orange-600 dark:text-orange-400"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingEntry(entry)}
                                className="text-sm font-bold text-red-600 dark:text-red-400"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              )}

              <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                <span className="font-bold">
                  {isToday ? "Today's total" : 'Day total'}
                </span>
                <span className="text-lg font-extrabold text-orange-600 dark:text-orange-400">
                  {formatMoney(day.total)}
                </span>
              </div>
            </>
          )}

          {entryError && (
            <p className="mt-2 text-sm text-red-600">{entryError}</p>
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
                New amounts are saved for today, with the time recorded
                automatically.
              </p>
            </form>
          )}

          {isAdmin && (
            <div className="mt-4 flex gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
              <button
                type="button"
                onClick={() => onEdit(customer)}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-bold dark:border-gray-600"
              >
                Edit customer
              </button>
              <button
                type="button"
                onClick={() => onDelete(customer)}
                className="flex-1 rounded-lg border border-red-300 py-2 text-sm font-bold text-red-600 dark:border-red-800 dark:text-red-400"
              >
                Delete customer
              </button>
            </div>
          )}
        </div>
      )}

      {deletingEntry && (
        <ConfirmDialog
          title="Delete this entry?"
          message={`${formatMoney(deletingEntry.amount)} at ${formatTime(deletingEntry.entryTime)} will be removed from ${customer.name}'s account. This cannot be undone.`}
          confirmLabel="Delete"
          danger
          busy={entryBusy}
          onConfirm={confirmDeleteEntry}
          onCancel={() => setDeletingEntry(null)}
        />
      )}
    </section>
  )
}

export default CustomerCard