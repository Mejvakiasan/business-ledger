import Dexie from 'dexie'

export const db = new Dexie('teashop')

    db.version(1).stores({
        items: 'id',
        kv: 'key',
        history: 'id, completedAt' 
    })
