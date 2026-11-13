import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { ThemeContext } from './themeStore'

const STORAGE_KEY = 'themeChoices'

function readChoices() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider({ children }) {
  const { user } = useAuth()
  const [choices, setChoices] = useState(readChoices)

  const key = user ? user.username : 'guest'
  const theme = choices[key] ?? systemTheme()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  function setTheme(next) {
    const updated = { ...choices, [key]: next }
    setChoices(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // storage can be blocked; the theme still works until the page closes
    }
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}