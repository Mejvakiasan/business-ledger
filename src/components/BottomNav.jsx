import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { tabs } from '../config/tabs'

function BottomNav() {
  const { user } = useAuth()
  const visibleTabs = tabs.filter((tab) => tab.roles.includes(user.role))

  return (
    <nav className="fixed bottom-0 inset-x-0 flex border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-gray-700 dark:bg-gray-900">
      {visibleTabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm ${
              isActive
                ? 'font-bold text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-300'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav