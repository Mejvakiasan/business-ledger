import { mockCustomers, mockEntries } from '../data/mockAccount'
import { toDateKey } from '../utils/dates'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let customers = [...mockCustomers]
let entries = [...mockEntries]

function assertOnline() {
  if (!navigator.onLine) throw new Error('You are offline')
}

function withTotal(customer) {
  const total = entries
    .filter((entry) => entry.customerId === customer.id)
    .reduce((sum, entry) => sum + entry.amount, 0)
  return { ...customer, total }
}

export async function getCustomers(search = '') {
  assertOnline()
  await wait(300)
  const text = search.trim().toLowerCase()
  return customers
    .filter(
      (customer) =>
        customer.name.toLowerCase().includes(text) ||
        customer.mobile.includes(text)
    )
    .map(withTotal)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getCustomer(id) {
  assertOnline()
  await wait(200)
  const customer = customers.find((c) => c.id === id)
  return customer ? withTotal(customer) : null
}

export async function addCustomer({ name, mobile, amount }) {
  assertOnline()
  await wait(300)

  const customerId = customers.reduce((max, c) => Math.max(max, c.id), 0) + 1
  const entryId = entries.reduce((max, e) => Math.max(max, e.id), 0) + 1

  const customer = { id: customerId, name: name.trim(), mobile: mobile.trim() }
  customers = [...customers, customer]
  entries = [
    ...entries,
    {
      id: entryId,
      customerId,
      amount: Number(amount),
      entryTime: new Date().toISOString(),
    },
  ]

  return withTotal(customer)
}

export async function getDayEntries(customerId, dateKey) {
  assertOnline()
  await wait(250)

  const dayEntries = entries
    .filter(
      (entry) =>
        entry.customerId === customerId &&
        toDateKey(entry.entryTime) === dateKey
    )
    .sort((a, b) => b.entryTime.localeCompare(a.entryTime))

  const total = dayEntries.reduce((sum, entry) => sum + entry.amount, 0)

  return { entries: dayEntries, total }
}

export async function addEntry(customerId, amount) {
  assertOnline()
  await wait(300)

  const entryId = entries.reduce((max, e) => Math.max(max, e.id), 0) + 1
  const entry = {
    id: entryId,
    customerId,
    amount: Number(amount),
    entryTime: new Date().toISOString(),
  }

  entries = [...entries, entry]
  return entry
}