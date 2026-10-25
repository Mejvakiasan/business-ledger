import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext.jsx"
import BottomNav from "./components/BottomNav"
import Header from "./components/Header"

import HomePage from "./pages/HomePage"
import StockPage from "./pages/StockPage"
import CalculatorPage from "./pages/CalculatorPage"
import AccountPage from "./pages/AccountPage"
import GroceryPage from "./pages/GroceryPage"
import SettingPage from "./pages/SettingPage"
import LoginPage from "./pages/LoginPage"

// function Page({title}){
//   return <h1 className="p-4 text-3xl font-bold text-orange-600">{title}</h1>
// }

function getStartTheme(){
  const saved = localStorage.getItem('theme')
  if(saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
  ? 'dark' : 'light'
}

function App() {
  const {user} = useAuth()
  const[theme, setTheme] = useState(getStartTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme(){
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-white pb-16 text-gray-900 dark:bg-gray-900 dark:bg-gray-100" >
     
     {user ? (
      <>
      <Header theme={theme} onToggle={toggleTheme} />
   <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/stock" element={<StockPage/>} />
      <Route path="/calculator" element={<CalculatorPage/>} />
      <Route path="/account" element={<AccountPage/>} />
      <Route path="/grocery" element={<GroceryPage/>} />
      <Route path="/setting" element={<SettingPage/>} />
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
