import { useState, useEffect } from 'react'
import { getProducts } from '../api/stock'
import ProductCard from '../components/ProductCard'
import CategorySection from '../components/CategorySection'

function StockPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const groups = products.reduce((result, product) => {
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
            Total items: {products.length}
          </p>

          {Object.entries(groups).map(([category, items]) => (
            <CategorySection key={category} category={category} items={items} />
            // <section key={category} className="mt-6">
            //   <h2 className="mb-2 text-lg font-bold">
            //     {category} ({items.length})
            //   </h2>
            //   <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            //     {items.map((product) => (
            //       <ProductCard key={product.id} product={product} />
            //     ))}
            //   </div>
            // </section>
          ))}
        </>
      )}
    </div>
  )
}

export default StockPage