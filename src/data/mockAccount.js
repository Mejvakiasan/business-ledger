const at = (daysAgo, hour, minute = 0) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

export const mockCustomers = [
  { id: 1, name: 'Ravi', mobile: '9876543210' },
  { id: 2, name: 'Priya', mobile: '9123456780' },
  { id: 3, name: 'Kumar', mobile: '' },
  { id: 4, name: 'Meena', mobile: '9988776655' },
  { id: 5, name: 'Saravanan', mobile: '9090909090' },
]

export const mockEntries = [
  { id: 1, customerId: 1, amount: 40, entryTime: at(0, 9, 15) },
  { id: 2, customerId: 1, amount: 25, entryTime: at(0, 16, 30) },
  { id: 3, customerId: 1, amount: 60, entryTime: at(1, 10, 5) },
  { id: 4, customerId: 1, amount: 35, entryTime: at(3, 8, 45) },
  { id: 5, customerId: 1, amount: 80, entryTime: at(12, 17, 20) },
  { id: 6, customerId: 1, amount: 120, entryTime: at(35, 11, 0) },
  { id: 7, customerId: 2, amount: 50, entryTime: at(0, 8, 30) },
  { id: 8, customerId: 2, amount: 90, entryTime: at(2, 15, 10) },
  { id: 9, customerId: 2, amount: 45, entryTime: at(9, 9, 0) },
  { id: 10, customerId: 3, amount: 20, entryTime: at(1, 12, 15) },
  { id: 11, customerId: 3, amount: 150, entryTime: at(20, 18, 0) },
  { id: 12, customerId: 4, amount: 75, entryTime: at(4, 10, 40) },
  { id: 13, customerId: 5, amount: 30, entryTime: at(0, 7, 50) },
  { id: 14, customerId: 5, amount: 210, entryTime: at(6, 14, 25) },
  { id: 15, customerId: 5, amount: 65, entryTime: at(40, 9, 30) },
]