import { formatMoney } from '../utils/grocery'

function CustomerRow({ customer }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <div className="min-w-0">
        <p className="truncate font-bold">{customer.name}</p>
        {customer.mobile && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {customer.mobile}
          </p>
        )}
      </div>
      <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
        {formatMoney(customer.total)}
      </p>
    </div>
  )
}

export default CustomerRow