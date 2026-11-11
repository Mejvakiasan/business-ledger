import { useState, useEffect } from 'react'
import { getMonthSummary } from '../api/account'
import { formatMoney } from '../utils/grocery'
import {
  buildMonthGrid,
  monthKeyOf,
  dayKeyOf,
  monthLabel,
  shortMoney,
} from '../utils/calendar'

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function MonthCalendar({ customerId, selectedKey, todayKey, version, onSelect }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [monthIndex, setMonthIndex] = useState(now.getMonth())
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  const currentKey = monthKeyOf(year, monthIndex)
  const isCurrentMonth =
    year === now.getFullYear() && monthIndex === now.getMonth()

  useEffect(() => {
    let cancelled = false

    getMonthSummary(customerId, currentKey)
      .then((data) => {
        if (cancelled) return
        setSummary({ key: currentKey, ...data })
        setError('')
      })
      .catch(() => {
        if (!cancelled) setError('Needs internet. Connect and try again.')
      })

    return () => {
      cancelled = true
    }
  }, [customerId, currentKey, version])

  function goToMonth(change) {
    const date = new Date(year, monthIndex + change, 1)
    setYear(date.getFullYear())
    setMonthIndex(date.getMonth())
  }

  const loaded = summary && summary.key === currentKey
  const weeks = buildMonthGrid(year, monthIndex)

  return (
    <div className="mt-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="Previous month"
          className="h-9 w-9 rounded-lg text-xl font-bold"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-bold">{monthLabel(year, monthIndex)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {loaded ? `Month total ${formatMoney(summary.total)}` : 'Loading...'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          disabled={isCurrentMonth}
          aria-label="Next month"
          className="h-9 w-9 rounded-lg text-xl font-bold disabled:opacity-30"
        >
          ›
        </button>
      </div>

      {error && (
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {error}
        </p>
      )}

      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((letter, index) => (
          <div
            key={index}
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {letter}
          </div>
        ))}

        {weeks.flat().map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />

          const key = dayKeyOf(year, monthIndex, day)
          const total = loaded ? summary.days[key] : undefined
          const isToday = key === todayKey
          const isSelected = key === selectedKey
          const isFuture = key > todayKey

          return (
            <button
              key={key}
              type="button"
              disabled={isFuture}
              onClick={() => onSelect(key)}
              aria-label={`${key}${total ? `, total ${total}` : ''}`}
              aria-pressed={isSelected}
              className={`flex h-12 flex-col items-center justify-center rounded-lg text-sm disabled:opacity-30 ${
                isSelected
                  ? 'bg-orange-600 text-white'
                  : isToday
                    ? 'border border-orange-500 font-bold'
                    : 'bg-white dark:bg-gray-900'
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[10px] leading-3 font-bold ${
                  isSelected
                    ? 'text-white'
                    : 'text-orange-600 dark:text-orange-400'
                }`}
              >
                {total ? shortMoney(total) : ' '}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthCalendar