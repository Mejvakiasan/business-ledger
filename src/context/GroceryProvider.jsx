import { useState, useEffect } from 'react'
import { GroceryContext } from './groceryStore'
import { db } from '../db/db'

export function GroceryProvider({ children }) {
  const [list, setList] = useState(null)
  const [history, setHistory] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const saved = await db.kv.get('activeList')
        const records = await db.history
          .orderBy('completedAt')
          .reverse()
          .toArray()
        if (cancelled) return
        setList(saved ? saved.value : null)
        setHistory(records)
      } catch (error) {
        console.error('Could not read saved data', error)
      }
      if (!cancelled) setReady(true)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const write = list
      ? db.kv.put({ key: 'activeList', value: list })
      : db.kv.delete('activeList')
    write.catch((error) => console.error('Could not save list', error))
  }, [list, ready])

  function finishPurchase(record) {
    setHistory((current) => [record, ...current])
    setList(null)
    db.transaction('rw', db.history, db.kv, async () => {
      await db.history.put(record)
      await db.kv.delete('activeList')
    }).catch((error) => console.error('Could not save purchase', error))
  }

  function deleteHistory(id) {
    setHistory((current) => current.filter((record) => record.id !== id))
    db.history.delete(id).catch((error) => console.error(error))
  }

  return (
    <GroceryContext.Provider
      value={{ list, setList, history, finishPurchase, deleteHistory, ready }}
    >
      {children}
    </GroceryContext.Provider>
  )
}