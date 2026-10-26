import { createContext, useContext } from 'react'

export const GroceryContext = createContext(null)

export function useGrocery() {
  return useContext(GroceryContext)
}