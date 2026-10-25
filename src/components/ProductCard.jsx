function ProductCard({ product }) {
  const low = product.quantity < 10

  const badgeStyle = low
    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300'
    : 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300'

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {product.image ? (
        <img
          className="mb-4 h-24 w-full rounded-lg object-cover"
          src={product.image}
          alt={product.name}
        />
      ) : (
        <div className="mb-4 flex h-24 w-full items-center justify-center rounded-lg bg-orange-50 text-4xl dark:bg-gray-700">
          🍵
        </div>
      )}

      <span
        className={`inline-block rounded-sm border px-1.5 py-0.5 text-xs font-medium ${badgeStyle}`}
      >
        {low ? 'Low stock' : 'In stock'}: {product.quantity}
      </span>

      <h5 className="mt-2 text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        {product.name}
      </h5>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
          ₹{product.price}
        </span>
      </div>
    </div>
  )
}

export default ProductCard