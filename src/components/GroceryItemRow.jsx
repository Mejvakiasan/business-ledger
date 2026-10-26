import QuantityControl from './QuantityControl'
import { formatMoney } from '../utils/grocery'

function GroceryItemRow({ item, onQuantityChange, onStatusChange, onRemove }) {
  const unavailable = item.status === 'UNAVAILABLE'

  return (
    <div
      className={`rounded-xl border p-3 ${
        unavailable
          ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className={`font-bold ${
              unavailable ? 'text-red-700 dark:text-red-300' : ''
            }`}
          >
            {item.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatMoney(item.price)} × {item.quantity} ={' '}
            <span
              className={`font-bold ${
                unavailable
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-orange-600 dark:text-orange-400'
              }`}
            >
              {formatMoney(item.price * item.quantity)}
            </span>
            {unavailable && ' (not counted)'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="text-sm text-gray-500 underline dark:text-gray-400"
        >
          Remove
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <QuantityControl
          key={`${item.productId}-${item.quantity}`}
          value={item.quantity}
          onChange={(quantity) => onQuantityChange(item.productId, quantity)}
        />

        <button
          type="button"
          onClick={() => onStatusChange(item.productId, 'UNAVAILABLE')}
          aria-pressed={unavailable}
          className={`rounded-lg border px-3 py-2 text-sm font-bold ${
            unavailable
              ? 'border-red-600 bg-red-600 text-white'
              : 'border-red-300 text-red-600 dark:border-red-800 dark:text-red-400'
          }`}
        >
          {unavailable ? 'Revert' : 'Not Available'}
        </button>
      </div>
    </div>
  )
}

export default GroceryItemRow