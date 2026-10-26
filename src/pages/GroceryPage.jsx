import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGrocery } from '../context/groceryStore'
import { getGroceryLookup } from '../api/stock'
import {
  calcSpent,
  formatMoney,
  addToList,
  setQuantity,
  removeFromList,
  setStatus,
  countByStatus,
  completePurchase,
} from '../utils/grocery'
import BudgetSetup from '../components/BudgetSetup'
import BudgetBar from '../components/BudgetBar'
import SearchBox from '../components/SearchBox'
import GroceryItemRow from '../components/GroceryItemRow'
import ConfirmDialog from '../components/ConfirmDialog'
import HistoryList from '../components/HistoryList'

function GroceryPage() {
  const { user } = useAuth()
  const { list, setList, history, addHistory, deleteHistory } = useGrocery()
  const [tab, setTab] = useState('list')
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [confirmComplete, setConfirmComplete] = useState(false)
  const [stockItems, setStockItems] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getGroceryLookup().then(setStockItems)
  }, [])

  if (user.role === 'CUSTOMER') {
    return <Navigate to="/" replace />
  }

  function startList(estimate) {
    setList({
      id: Date.now(),
      estimate,
      items: [],
      startedAt: new Date().toISOString(),
    })
  }

  function discardList() {
    setList(null)
    setConfirmDiscard(false)
    setQuery('')
  }

  function handleAdd(product) {
    setList((current) => ({
      ...current,
      items: addToList(current.items, product),
    }))
    setQuery('')
  }

  function handleQuantity(productId, quantity) {
    setList((current) => ({
      ...current,
      items: setQuantity(current.items, productId, quantity),
    }))
  }

  function handleStatus(productId, status) {
    setList((current) => ({
      ...current,
      items: setStatus(current.items, productId, status),
    }))
  }

  function handleComplete() {
    const record = completePurchase(list, user.username)
    addHistory(record)
    setList(null)
    setConfirmComplete(false)
    setTab('history')
  }

  function handleRemove(productId) {
    setList((current) => ({
      ...current,
      items: removeFromList(current.items, productId),
    }))
  }

  const counts = list ? countByStatus(list.items) : null
  const canComplete = list ? list.items.length > 0 : false

  const text = query.trim().toLowerCase()
  const results =
    text && stockItems
      ? stockItems
          .filter((item) => item.name.toLowerCase().includes(text))
          .slice(0, 8)
      : []

  const tabStyle = (name) =>
    `flex-1 rounded-lg py-2 text-sm font-bold ${
      tab === name
        ? 'bg-orange-600 text-white'
        : 'text-gray-600 dark:text-gray-300'
    }`

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-orange-600">Grocery</h1>

      <div className="mt-4 flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        <button type="button" onClick={() => setTab('list')} className={tabStyle('list')}>
          List
        </button>
        <button type="button" onClick={() => setTab('history')} className={tabStyle('history')}>
          History ({history.length})
        </button>
      </div>

      {tab === 'history' && (
        <HistoryList
          history={history}
          canDelete={user.role === 'ADMIN'}
          onDelete={deleteHistory}
        />
      )}

      {tab === 'list' && !list && <BudgetSetup onStart={startList} />}

      {tab === 'list' && list && (
        <>
          <BudgetBar estimate={list.estimate} spent={calcSpent(list.items)} />

          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search item to add"
          />

          {text && (
            <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              {!stockItems && (
                <p className="p-3 text-gray-500 dark:text-gray-400">
                  Loading items...
                </p>
              )}

              {stockItems && results.length === 0 && (
                <p className="p-3 text-gray-500 dark:text-gray-400">
                  No items found
                </p>
              )}

              {results.map((item) => {
                const onList = list.items.find((i) => i.productId === item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAdd(item)}
                    className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-3 text-left last:border-b-0 dark:border-gray-800"
                  >
                    <span>
                      <span className="font-bold">{item.name}</span>
                      {onList && (
                        <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">
                          On list: {onList.quantity}
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      {formatMoney(item.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          <h2 className="mt-6 text-lg font-bold">
            Your list ({list.items.length}{' '}
            {list.items.length === 1 ? 'item' : 'items'})
          </h2>

          {list.items.length > 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              To buy {counts.PENDING} · Not available {counts.UNAVAILABLE}
            </p>
          )}

          {list.items.length === 0 ? (
            <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
              Your list is empty. Search above and tap an item to add it.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {list.items.map((item) => (
                <GroceryItemRow
                  key={item.productId}
                  item={item}
                  onQuantityChange={handleQuantity}
                  onStatusChange={handleStatus}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setConfirmComplete(true)}
            disabled={!canComplete}
            className="mt-6 w-full rounded-lg bg-orange-600 py-3 font-bold text-white disabled:opacity-40"
          >
            Complete purchase
          </button>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Items not marked as not available are saved as bought.
          </p>

          <button
            type="button"
            onClick={() => setConfirmDiscard(true)}
            className="mt-3 w-full rounded-lg border border-red-300 py-3 font-bold text-red-600 dark:border-red-800 dark:text-red-400"
          >
            Discard list
          </button>
        </>
      )}

      {confirmComplete && (
        <ConfirmDialog
          title="Complete this purchase?"
          message={`${counts.PENDING} ${counts.PENDING === 1 ? 'item' : 'items'} will be saved as bought (${formatMoney(calcSpent(list.items))}). ${counts.UNAVAILABLE} not available.`}
          confirmLabel="Complete"
          onConfirm={handleComplete}
          onCancel={() => setConfirmComplete(false)}
        />
      )}

      {confirmDiscard && (
        <ConfirmDialog
          title="Discard this list?"
          message="The budget and all items on this list will be removed."
          confirmLabel="Discard"
          danger
          onConfirm={discardList}
          onCancel={() => setConfirmDiscard(false)}
        />
      )}
    </div>
  )
}

export default GroceryPage