/**
 * hooks/useCart.js
 *
 * LESSON: useState vs useQuery
 * Cart data lives locally in the browser (no API needed yet).
 * We use React's built-in useState for this — not TanStack Query.
 *
 * Rule of thumb:
 *   - Server/API data → TanStack Query (useQuery / useMutation)
 *   - Local UI state  → useState / useReducer / Context
 *
 * We use localStorage so the cart persists across page refreshes.
 * Later, when we have a backend, we'll sync the cart with the server.
 */

import { useState, useEffect } from 'react'

function loadCart() {
  try {
    const saved = localStorage.getItem('techvault_cart')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

export function useCart() {
  const [items, setItems] = useState(loadCart)

  // Persist to localStorage every time items change
  useEffect(() => {
    localStorage.setItem('techvault_cart', JSON.stringify(items))
  }, [items])

  function addItem(product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      }
      return [...prev, { ...product, qty }]
    })
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateQty(id, qty) {
    if (qty < 1) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  function clearCart() { setItems([]) }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return { items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }
}