import { useState, useEffect, useCallback, useRef } from 'react'
import { GroceryContext } from './groceryStore'
import { db } from '../db/db'
import { sendPurchase } from '../api/grocery'

export function GroceryProvider({ children }) {
  const [list, setList] = useState(null)
  const [history, setHistory] = useState([])
  const [ready, setReady] = useState(false)
  const syncRef = useRef(null)

  const syncNow = useCallback(() => {
    if (syncRef.current) return syncRef.current
    if (!navigator.onLine) return Promise.resolve()

    const run = (async () => {
      const all = await db.history.orderBy('completedAt').toArray()
      const waiting = all.filter((record) => record.syncStatus !== 'SYNCED')

      for (const record of waiting) {
        try {
          await sendPurchase(record)
        } catch (error) {
          console.warn('Could not send purchase, will retry:', error.message)
          break
        }
        await db.history.update(record.id, { syncStatus: 'SYNCED' })
        setHistory((current) =>
          current.map((r) =>
            r.id === record.id ? { ...r, syncStatus: 'SYNCED' } : r
          )
        )
      }
    })()
      .catch((error) => console.error('Sync failed', error))
      .finally(() => {
        syncRef.current = null
      })

    syncRef.current = run
    return run
  }, [])

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

  useEffect(() => {
    if (!ready) return
    syncNow()
    window.addEventListener('online', syncNow)
    return () => window.removeEventListener('online', syncNow)
  }, [ready, syncNow])

  function finishPurchase(record) {
    setHistory((current) => [record, ...current])
    setList(null)
    db.transaction('rw', db.history, db.kv, async () => {
      await db.history.put(record)
      await db.kv.delete('activeList')
    })
      .then(() => syncNow())
      .catch((error) => console.error('Could not save purchase', error))
  }

  function deleteHistory(id) {
    setHistory((current) => current.filter((record) => record.id !== id))
    db.history.delete(id).catch((error) => console.error(error))
  }

  async function countUnsynced() {
    const all = await db.history.toArray()
    return all.filter((record) => record.syncStatus !== 'SYNCED').length
  }

  async function clearLocalData() {
    await db.transaction('rw', db.items, db.kv, db.history, async () => {
      await db.items.clear()
      await db.kv.clear()
      await db.history.clear()
    })
    setList(null)
    setHistory([])
  }

  const unsyncedCount = history.filter(
    (record) => record.syncStatus !== 'SYNCED'
  ).length

  return (
    <GroceryContext.Provider
      value={{
        list,
        setList,
        history,
        finishPurchase,
        deleteHistory,
        ready,
        unsyncedCount,
        syncNow,
        countUnsynced,
        clearLocalData,
      }}
    >
      {children}
    </GroceryContext.Provider>
  )
}