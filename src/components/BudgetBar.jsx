import { formatMoney } from '../utils/grocery'

function BudgetBar({ estimate, spent }) {
  const remaining = estimate - spent
  const over = remaining < 0

  return (
    <div className="sticky top-[4.3rem] z-30 mt-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="grid grid-cols-3 text-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Estimate</p>
          <p className="font-bold">{formatMoney(estimate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Spent</p>
          <p className="font-bold">{formatMoney(spent)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
          <p
            className={`font-bold ${
              over
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-700 dark:text-green-400'
            }`}
          >
            {formatMoney(remaining)}
          </p>
        </div>
      </div>

      {over && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
          Over budget by {formatMoney(Math.abs(remaining))}
        </p>
      )}
    </div>
  )
}

export default BudgetBar