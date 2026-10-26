import { useState } from 'react'
import ProductCard from './ProductCard'

function CategorySection({ category, items, forceOpen = false, ...cardProps }) {
  const [open, setOpen] = useState(false)
  const isOpen = open || forceOpen

  return (
    <section className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-lg font-bold">
          {category}{' '}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({items.length} items)
          </span>
        </span>
        <span
          className={`text-xl text-orange-600 transition-transform dark:text-orange-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
        
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 gap-3 px-4 pb-4 md:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} {...cardProps} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CategorySection