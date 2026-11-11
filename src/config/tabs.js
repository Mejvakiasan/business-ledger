export const ALL_ROLES = ['ADMIN', 'STAFF', 'CUSTOMER']
export const STAFF_UP = ['ADMIN', 'STAFF']

export const tabs = [
  { to: '/stock', label: 'Stock', roles: ALL_ROLES },
  { to: '/calculator', label: 'Calculator', roles: ALL_ROLES },
  { to: '/grocery', label: 'Grocery', roles: STAFF_UP },
  { to: '/account', label: 'Account', roles: ALL_ROLES },
  { to: '/setting', label: 'Setting', roles: ALL_ROLES },
]