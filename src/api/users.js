import { mockUsers } from '../data/mockUsers'
import { getCustomers } from './account'
import { allowedActions } from '../utils/userRules'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const roleOrder = { ADMIN: 0, STAFF: 1, CUSTOMER: 2 }

function assertOnline() {
  if (!navigator.onLine) throw new Error('OFFLINE')
}

function assertAdmin(actor) {
  if (!actor || actor.role !== 'ADMIN') throw new Error('FORBIDDEN')
}

function toPublic(user) {
  const copy = { ...user }
  delete copy.password
  return copy
}

function findUser(id) {
  const user = mockUsers.find((u) => u.id === id)
  if (!user) throw new Error('NOT_FOUND')
  return user
}

function usernameTaken(username, exceptId) {
  const lower = username.trim().toLowerCase()
  return mockUsers.some(
    (u) => u.id !== exceptId && u.username.toLowerCase() === lower
  )
}

export async function listUsers(actor) {
  assertOnline()
  await wait(250)
  assertAdmin(actor)
  return mockUsers
    .map(toPublic)
    .sort(
      (a, b) =>
        roleOrder[a.role] - roleOrder[b.role] || a.name.localeCompare(b.name)
    )
}

export async function listFreeCustomers() {
  const customers = await getCustomers('')
  const linked = new Set(mockUsers.map((u) => u.customerId).filter(Boolean))
  return customers.filter((customer) => !linked.has(customer.id))
}

export async function createUser(actor, data) {
  assertOnline()
  await wait(300)
  assertAdmin(actor)

  if (!['STAFF', 'CUSTOMER'].includes(data.role)) throw new Error('FORBIDDEN')
  if (usernameTaken(data.username)) throw new Error('USERNAME_TAKEN')
  if (data.role === 'CUSTOMER' && !data.customerId) {
    throw new Error('CUSTOMER_REQUIRED')
  }

  const id = mockUsers.reduce((max, u) => Math.max(max, u.id), 0) + 1
  const user = {
    id,
    username: data.username.trim(),
    password: data.password,
    name: data.name.trim(),
    role: data.role,
    mobile: data.mobile.trim(),
    status: 'ACTIVE',
    mustChangePassword: true,
  }
  if (data.role === 'CUSTOMER') user.customerId = Number(data.customerId)

  mockUsers.push(user)
  return toPublic(user)
}

export async function updateUser(actor, id, data) {
  assertOnline()
  await wait(250)
  assertAdmin(actor)

  const target = findUser(id)
  if (!allowedActions(target, actor).edit) throw new Error('FORBIDDEN')

  if (data.username !== target.username) {
    if (id === actor.id) throw new Error('FORBIDDEN')
    if (usernameTaken(data.username, id)) throw new Error('USERNAME_TAKEN')
    target.username = data.username.trim()
  }

  target.name = data.name.trim()
  target.mobile = data.mobile.trim()
}

export async function removeUser(actor, id) {
  assertOnline()
  await wait(250)
  assertAdmin(actor)

  const target = findUser(id)
  if (!allowedActions(target, actor).remove) throw new Error('FORBIDDEN')

  mockUsers.splice(mockUsers.indexOf(target), 1)
}

export async function setUserStatus(actor, id, status) {
  assertOnline()
  await wait(250)
  assertAdmin(actor)

  const target = findUser(id)
  if (!allowedActions(target, actor).toggleStatus) throw new Error('FORBIDDEN')

  target.status = status
}

export async function changeUserRole(actor, id, role) {
  assertOnline()
  await wait(250)
  assertAdmin(actor)

  const target = findUser(id)
  const allowed = allowedActions(target, actor)
  if (role === 'ADMIN' && !allowed.promote) throw new Error('FORBIDDEN')
  if (role === 'STAFF' && !allowed.demote) throw new Error('FORBIDDEN')

  target.role = role
}