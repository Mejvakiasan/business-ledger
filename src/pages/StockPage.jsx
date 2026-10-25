import { useState, useEffect } from 'react'
import { getProducts } from '../api/stock'
import SearchBox from '../components/SearchBox'
import CategorySection from '../components/CategorySection'

function StockPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const text = query.trim().toLowerCase()

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(text) ||
      p.category.toLowerCase().includes(text)
  )

  const groups = filtered.reduce((result, product) => {
    if (!result[product.category]) result[product.category] = []
    result[product.category].push(product)
    return result
  }, {})

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-orange-600">Stock</h1>

      {loading ? (
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {text
              ? `Showing ${filtered.length} of ${products.length} items`
              : `Total items: ${products.length}`}
          </p>

          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search items or category"
          />

          {filtered.length === 0 && (
            <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
              No items found
            </p>
          )}

          {Object.entries(groups).map(([category, items]) => (
            <CategorySection
              key={category}
              category={category}
              items={items}
              forceOpen={text !== ''}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default StockPage