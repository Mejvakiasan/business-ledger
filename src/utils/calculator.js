const MAX_DIGITS = 12

export const initialState = {
  display: '0',
  stored: null,
  operator: null,
  fresh: true,
  error: false,
}

export const operatorSymbols = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
}

function calculate(a, b, operator) {
  if (operator === '+') return a + b
  if (operator === '-') return a - b
  if (operator === '*') return a * b
  if (operator === '/') return b === 0 ? null : a / b
  return b
}

export function formatNumber(value) {
  return String(Number(value.toPrecision(MAX_DIGITS)))
}

const errorState = { ...initialState, display: 'Cannot divide by 0', error: true }

export function inputDigit(state, digit) {
  if (state.error) return { ...initialState, display: digit, fresh: false }
  if (state.fresh) return { ...state, display: digit, fresh: false }
  if (state.display.replace(/[-.]/g, '').length >= MAX_DIGITS) return state
  return {
    ...state,
    display: state.display === '0' ? digit : state.display + digit,
  }
}

export function inputDecimal(state) {
  if (state.error) return { ...initialState, display: '0.', fresh: false }
  if (state.fresh) return { ...state, display: '0.', fresh: false }
  if (state.display.includes('.')) return state
  return { ...state, display: state.display + '.' }
}

export function chooseOperator(state, operator) {
  if (state.error) return state

  if (state.operator && state.fresh) {
    return { ...state, operator }
  }

  if (state.operator) {
    const result = calculate(state.stored, Number(state.display), state.operator)
    if (result === null) return errorState
    return {
      display: formatNumber(result),
      stored: result,
      operator,
      fresh: true,
      error: false,
    }
  }

  return {
    ...state,
    stored: Number(state.display),
    operator,
    fresh: true,
  }
}

export function equals(state) {
  if (state.error || !state.operator) return state
  const result = calculate(state.stored, Number(state.display), state.operator)
  if (result === null) return errorState
  return {
    display: formatNumber(result),
    stored: null,
    operator: null,
    fresh: true,
    error: false,
  }
}

export function backspace(state) {
  if (state.error) return initialState
  if (state.fresh) return state
  const short = state.display.length === 1 ||
    (state.display.length === 2 && state.display.startsWith('-'))
  return { ...state, display: short ? '0' : state.display.slice(0, -1) }
}