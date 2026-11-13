import { mockUsers } from '../data/mockUsers'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function changePassword(username, current, next) {
  if (!navigator.onLine) throw new Error('OFFLINE')
  await wait(400)

  const user = mockUsers.find((u) => u.username === username)
  if (!user || user.password !== current) throw new Error('WRONG_PASSWORD')

  user.password = next
}