import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCustomers, getCustomer, addCustomer } from '../api/account'
import { useDebounce } from '../hooks/useDebounce'
import SearchBox from '../components/SearchBox'
import CustomerCard from '../components/CustomerCard'
import AddCustomerForm from '../components/AddCustomerForm'

function CustomerManager() {
  const [query, setQuery] = useState('')
  const search = useDebounce(query, 300)
  const [customers, setCustomers] = useState(null)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let cancelled = false

    getCustomers(search)
      .then((data) => {
        if (cancelled) return
        setCustomers(data)
        setError('')
      })
      .catch(() => {
        if (!cancelled) setError('Account needs internet. Connect and try again.')
      })

    return () => {
      cancelled = true
    }
  }, [search, reload])

  async function handleAdd(data) {
    await addCustomer(data)
    setShowForm(false)
    setQuery('')
    setReload((count) => count + 1)
  }

  return (
    <div className="p-4 pb-28">
      <h1 className="text-3xl font-bold text-orange-600">Account</h1>

      <SearchBox
        value={query}
        onChange={setQuery}
        placeholder="Search name or mobile"
      />

      {error && (
        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <button
            type="button"
            onClick={() => setReload((count) => count + 1)}
            className="mt-3 rounded-lg border border-gray-300 px-4 py-2 font-bold dark:border-gray-600"
          >
            Try again
          </button>
        </div>
      )}

      {!error && customers === null && (
        <p className="mt-6 text-gray-500 dark:text-gray-400">Loading...</p>
      )}

      {!error && customers !== null && (
        <>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {customers.length} {customers.length === 1 ? 'customer' : 'customers'}
          </p>

          {customers.length === 0 ? (
            <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
              No customers found
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              {customers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  canAdd
                  onChanged={() => setReload((count) => count + 1)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() => setShowForm(true)}
        aria-label="Add customer"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-3xl text-white shadow-lg"
      >
        +
      </button>

      {showForm && (
        <AddCustomerForm
          onSave={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

function MyAccount({ customerId }) {
  const [customer, setCustomer] = useState(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!customerId) return
    let cancelled = false

    getCustomer(customerId)
      .then((data) => {
        if (cancelled) return
        setCustomer(data)
        setError('')
      })
      .catch(() => {
        if (!cancelled) setError('Account needs internet. Connect and try again.')
      })

    return () => {
      cancelled = true
    }
  }, [customerId])

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-orange-600">My Account</h1>

      {!customerId && (
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
          No account linked yet.
        </p>
      )}

      {customerId && error && (
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
          {error}
        </p>
      )}

      {customerId && !error && customer === undefined && (
        <p className="mt-6 text-gray-500 dark:text-gray-400">Loading...</p>
      )}

      {customerId && !error && customer === null && (
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
          No account linked yet.
        </p>
      )}

      {customerId && !error && customer && (
        <div className="mt-4">
          <CustomerCard customer={customer} canAdd={false} defaultOpen />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            This is your total amount.
          </p>
        </div>
      )}
    </div>
  )
}

function AccountPage() {
  const { user } = useAuth()
  const isStaff = ['ADMIN', 'STAFF'].includes(user.role)

  return isStaff ? <CustomerManager /> : <MyAccount customerId={user.customerId} />
}

export default AccountPage