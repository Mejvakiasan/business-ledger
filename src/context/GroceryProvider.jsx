import { useState } from 'react'
import { GroceryContext } from './groceryStore'

export function GroceryProvider({ children }) {
  const [list, setList] = useState(null)
  const [history, setHistory] = useState([])

  function addHistory(record) {
    setHistory((current) => [record, ...current])
  }

  function deleteHistory(id) {
    setHistory((current) => current.filter((record) => record.id !== id))
  }

  return (
    <GroceryContext.Provider
      value={{ list, setList, history, addHistory, deleteHistory }}
    >
      {children}
    </GroceryContext.Provider>
  )
}