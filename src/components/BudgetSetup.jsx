import { useState } from 'react'

function BudgetSetup({ onStart }) {
  const [estimate, setEstimate] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const amount = Number(estimate)
    if (!(amount > 0)) {
      setError('Enter an estimate greater than 0')
      return
    }
    onStart(amount)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
    >
      <h2 className="text-lg font-bold">Set your budget</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        How much do you plan to spend on this shopping trip?
      </p>

      <label className="mb-1 mt-4 block text-sm">Estimate (₹)</label>
      <input
        type="number"
        inputMode="decimal"
        value={estimate}
        onChange={(e) => {
          setEstimate(e.target.value)
          setError('')
        }}
        placeholder="Example: 1000"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800"
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-orange-600 py-3 font-bold text-white"
      >
        Start list
      </button>
    </form>
  )
}

export default BudgetSetup