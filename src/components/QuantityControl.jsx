import { useState } from 'react'

function QuantityControl({ value, onChange }) {
  const [text, setText] = useState(String(value))

  function commit() {
    const number = Number(text)
    if (Number.isInteger(number) && number >= 1) {
      onChange(Math.min(999, number))
    } else {
      setText(String(value))
    }
  }

  const buttonStyle =
    'h-9 w-9 rounded-lg border border-gray-300 text-xl font-bold disabled:opacity-40 dark:border-gray-600'

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className={buttonStyle}
      >
        −
      </button>

      <input
        type="number"
        inputMode="numeric"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        aria-label="Quantity"
        className="h-9 w-14 rounded-lg border border-gray-300 bg-white text-center dark:border-gray-600 dark:bg-gray-800"
      />

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        className={buttonStyle}
      >
        +
      </button>
    </div>
  )
}

export default QuantityControl