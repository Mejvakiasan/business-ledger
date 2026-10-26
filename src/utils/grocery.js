const MAX_QUANTITY = 999

export function calcSpent(items) {
  return items
    .filter((item) => item.status !== 'UNAVAILABLE')
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function formatMoney(amount) {
  const sign = amount < 0 ? '-' : ''
  const number = Math.abs(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })
  return `${sign}₹${number}`
}

export function addToList(items, product) {
  const found = items.find((item) => item.productId === product.id)

  if (found) {
    return items.map((item) =>
      item.productId === product.id
        ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + 1) }
        : item
    )
  }

  return [
    ...items,
    {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      status: 'PENDING',
    },
  ]
}

export function setQuantity(items, productId, quantity) {
  const safe = Math.min(MAX_QUANTITY, Math.max(1, quantity))
  return items.map((item) =>
    item.productId === productId ? { ...item, quantity: safe } : item
  )
}

export function removeFromList(items, productId) {
  return items.filter((item) => item.productId !== productId)
}

export function setStatus(items, productId, status) {
  return items.map((item) => {
    if (item.productId !== productId) return item
    const next = item.status === status ? 'PENDING' : status
    return { ...item, status: next }
  })
}

export function countByStatus(items) {
  return items.reduce(
    (count, item) => {
      count[item.status] += 1
      return count
    },
    { PENDING: 0, UNAVAILABLE: 0 }
  )
}

export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function pickLine(item) {
  return { name: item.name, price: item.price, quantity: item.quantity }
}

export function completePurchase(list, username) {
  const bought = list.items.filter((item) => item.status !== 'UNAVAILABLE')
  const unavailable = list.items.filter((item) => item.status === 'UNAVAILABLE')

  const spent = calcSpent(bought)

  return {
    id: makeId(),
    completedAt: new Date().toISOString(),
    completedBy: username,
    estimate: list.estimate,
    spent,
    remaining: list.estimate - spent,
    bought: bought.map(pickLine),
    unavailable: unavailable.map(pickLine),
  }

}