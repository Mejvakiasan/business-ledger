import { useState } from 'react'
import { formatMoney, formatDateTime } from '../utils/grocery'

function Line({ line, red = false }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1">
      <div>
        <p className={`font-medium ${red ? 'text-red-700 dark:text-red-300' : ''}`}>
          {line.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatMoney(line.price)} × {line.quantity}
        </p>
      </div>
      <p className={`font-bold ${red ? 'text-red-600 dark:text-red-400' : ''}`}>
        {formatMoney(line.price * line.quantity)}
      </p>
    </div>
  )
}

function HistoryCard({ record, canDelete, onDelete }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span>
          <span className="block font-bold">
            {formatDateTime(record.completedAt)}
          </span>
          <span className="block text-sm text-gray-500 dark:text-gray-400">
            Spent {formatMoney(record.spent)} · {record.bought.length} bought
            {record.unavailable.length > 0 &&
              ` · ${record.unavailable.length} not available`}
          </span>
        </span>
        <span
          className={`text-xl text-orange-600 transition-transform dark:text-orange-400 ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="space-y-4 px-4 pb-4">
          <div className="grid grid-cols-3 rounded-lg bg-gray-100 p-2 text-center text-sm dark:bg-gray-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Estimate</p>
              <p className="font-bold">{formatMoney(record.estimate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Spent</p>
              <p className="font-bold">{formatMoney(record.spent)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
              <p className="font-bold">{formatMoney(record.remaining)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-green-700 dark:text-green-400">
              Bought items
            </h3>
            {record.bought.length === 0 ? (
              <p className="py-1 text-sm text-gray-500 dark:text-gray-400">
                Nothing bought
              </p>
            ) : (
              record.bought.map((line, index) => (
                <Line key={index} line={line} />
              ))
            )}
            <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
              <span className="font-bold">Overall price</span>
              <span className="text-lg font-extrabold text-orange-600 dark:text-orange-400">
                {formatMoney(record.spent)}
              </span>
            </div>
          </div>

          {record.unavailable.length > 0 && (
            <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/40">
              <h3 className="font-bold text-red-700 dark:text-red-300">
                Not available (not counted)
              </h3>
              {record.unavailable.map((line, index) => (
                <Line key={index} line={line} red />
              ))}
            </div>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(record)}
              className="w-full rounded-lg border border-red-300 py-2 text-sm font-bold text-red-600 dark:border-red-800 dark:text-red-400"
            >
              Delete record
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default HistoryCard