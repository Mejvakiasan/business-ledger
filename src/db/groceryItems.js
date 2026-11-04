import { db } from './db'
import { getGroceryLookup } from '../api/stock'

export async function loadGroceryItems() {
  try {
    const fresh = await getGroceryLookup()

    await db.transaction('rw', db.items, db.kv, async () => {
      await db.items.clear()
      await db.items.bulkPut(fresh)
      await db.kv.put({
        key: 'itemsUpdatedAt',
        value: new Date().toISOString(),
      })
    })

    return { items: fresh, fromCache: false, updatedAt: null }
  } catch {
    const items = await db.items.toArray()
    const saved = await db.kv.get('itemsUpdatedAt')
    return {
      items,
      fromCache: true,
      updatedAt: saved ? saved.value : null,
    }
  }
}