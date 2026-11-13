import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { useTheme } from './context/themeStore'
import { STAFF_UP, ADMIN_ONLY } from './config/tabs'
import BottomNav from './components/BottomNav'
import Header from './components/Header'
import OfflineBanner from './components/OfflineBanner'
import RequireRole from './components/RequireRole'

import HomePage from './pages/HomePage'
import StockPage from './pages/StockPage'
import CalculatorPage from './pages/CalculatorPage'
import AccountPage from './pages/AccountPage'
import GroceryPage from './pages/GroceryPage'
import SettingPage from './pages/SettingPage'
import UsersPage from './pages/UsersPage'
import LoginPage from './pages/LoginPage'

function App() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white pb-16 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {user ? (
        <>
          <Header theme={theme} onToggle={toggleTheme} />
          <OfflineBanner />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route
              path="/grocery"
              element={
                <RequireRole roles={STAFF_UP}>
                  <GroceryPage />
                </RequireRole>
              }
            />
            <Route path="/setting" element={<SettingPage />} />
            <Route
              path="/users"
              element={
                <RequireRole roles={ADMIN_ONLY}>
                  <UsersPage />
                </RequireRole>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  )
}

export default App