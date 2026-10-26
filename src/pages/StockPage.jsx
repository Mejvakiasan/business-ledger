import { useState, useEffect } from 'react'
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../api/stock'
import { useAuth } from '../context/AuthContext'
import SearchBox from '../components/SearchBox'
import CategorySection from '../components/CategorySection'
import AddProductForm from '../components/AddProductForm'
import ConfirmDialog from '../components/ConfirmDialog'

function StockPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const canEdit = ['ADMIN', 'STAFF'].includes(user.role)
  const canDelete = user.role === 'ADMIN'

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  function openAdd() {
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(product) {
    setEditing(product)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
  }

  async function handleSave(data) {
    if (editing) {
      const saved = await updateProduct(editing.id, data)
      setProducts((current) =>
        current.map((p) => (p.id === saved.id ? saved : p))
      )
    } else {
      const saved = await addProduct(data)
      setProducts((current) => [...current, saved])
    }
    closeForm()
  }

  async function handleDelete() {
    setBusy(true)
    await deleteProduct(deleting.id)
    setProducts((current) => current.filter((p) => p.id !== deleting.id))
    setBusy(false)
    setDeleting(null)
  }

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

  const categories = [...new Set(products.map((p) => p.category))]

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
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </>
      )}

      {canEdit && (
        <button
          type="button"
          onClick={openAdd}
          aria-label="Add product"
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-3xl text-white shadow-lg"
        >
          +
        </button>
      )}

      {showForm && (
        <AddProductForm
          product={editing}
          categories={categories}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete product?"
          message={`Delete ${deleting.name} from stock? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          busy={busy}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

export default StockPage