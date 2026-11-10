import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SimpleCalculator from '../components/SimpleCalculator'

function CalculatorPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('simple')

  const canUseAccount = ['ADMIN', 'STAFF'].includes(user.role)

  const tabStyle = (name) =>
    `flex-1 rounded-lg py-2 text-sm font-bold ${
      tab === name
        ? 'bg-orange-600 text-white'
        : 'text-gray-600 dark:text-gray-300'
    }`

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-orange-600">Calculator</h1>

      {canUseAccount && (
        <div className="mt-4 flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setTab('simple')}
            className={tabStyle('simple')}
          >
            Simple
          </button>
          <button
            type="button"
            onClick={() => setTab('account')}
            className={tabStyle('account')}
          >
            Account
          </button>
        </div>
      )}

      {tab === 'simple' && <SimpleCalculator />}

      {tab === 'account' && canUseAccount && (
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
          The account calculator comes after the Account module is built.
        </p>
      )}
    </div>
  )
}

export default CalculatorPage