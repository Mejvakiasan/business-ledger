const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const received = new Map()

export async function sendPurchase(record) {
  if (!navigator.onLine) throw new Error('You are offline')
  await wait(500)

  if (received.has(record.id)) {
    return { duplicate: true }
  }

  received.set(record.id, record)
  return { duplicate: false }
}

if (typeof window !== 'undefined') {
  window.fakeServer = {
    count: () => received.size,
    ids: () => [...received.keys()],
  }
}