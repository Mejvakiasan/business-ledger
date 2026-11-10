import { useState } from 'react'
import {
  initialState,
  operatorSymbols,
  inputDigit,
  inputDecimal,
  chooseOperator,
  equals,
  backspace,
  formatNumber,
} from '../utils/calculator'

const keyBase = 'h-16 rounded-xl text-2xl font-bold active:scale-95'
const numberKey = `${keyBase} bg-gray-100 dark:bg-gray-800`
const operatorKey = `${keyBase} bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300`
const actionKey = `${keyBase} bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200`

function SimpleCalculator() {
  const [state, setState] = useState(initialState)

  const digit = (d) => (
    <button
      key={d}
      type="button"
      className={numberKey}
      onClick={() => setState((s) => inputDigit(s, d))}
    >
      {d}
    </button>
  )

  const operator = (op, label) => (
    <button
      type="button"
      className={operatorKey}
      aria-label={label}
      onClick={() => setState((s) => chooseOperator(s, op))}
    >
      {operatorSymbols[op]}
    </button>
  )

  const expression =
    state.operator !== null
      ? `${formatNumber(state.stored)} ${operatorSymbols[state.operator]}`
      : ''

  return (
    <div className="mt-4">
      <div className="rounded-xl bg-gray-100 p-4 text-right dark:bg-gray-800">
        <p className="h-6 truncate text-sm text-gray-500 dark:text-gray-400">
          {expression}
        </p>
        <p
          className={`truncate font-bold ${
            state.error ? 'text-xl text-red-600' : 'text-4xl'
          }`}
          aria-live="polite"
        >
          {state.display}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        <button
          type="button"
          className={actionKey}
          aria-label="Clear"
          onClick={() => setState(initialState)}
        >
          C
        </button>
        <button
          type="button"
          className={actionKey}
          aria-label="Backspace"
          onClick={() => setState((s) => backspace(s))}
        >
          ⌫
        </button>
        {operator('/', 'Divide')}
        {operator('*', 'Multiply')}

        {digit('7')}
        {digit('8')}
        {digit('9')}
        {operator('-', 'Subtract')}

        {digit('4')}
        {digit('5')}
        {digit('6')}
        {operator('+', 'Add')}

        {digit('1')}
        {digit('2')}
        {digit('3')}
        <button
          type="button"
          aria-label="Equals"
          className={`${keyBase} row-span-2 h-auto bg-orange-600 text-white`}
          onClick={() => setState((s) => equals(s))}
        >
          =
        </button>

        <button
          type="button"
          className={`${numberKey} col-span-2`}
          onClick={() => setState((s) => inputDigit(s, '0'))}
        >
          0
        </button>
        <button
          type="button"
          className={numberKey}
          aria-label="Decimal point"
          onClick={() => setState((s) => inputDecimal(s))}
        >
          .
        </button>
      </div>
    </div>
  )
}

export default SimpleCalculator