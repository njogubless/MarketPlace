/**
 * src/context/CartContext.jsx — updated version
 *
 * LESSON: Hybrid cart strategy
 *
 * We use TWO cart systems depending on login state:
 *
 *   NOT logged in → localStorage cart (useLocalCart)
 *     Fast, works without backend, survives page refresh
 *     Stored in browser only — lost if user clears storage
 *
 *   Logged in → server cart (useServerCart / useCartActions)
 *     Stored in PostgreSQL via Django
 *     Works across devices, validated against stock
 *     Required for checkout
 *
 * When a user logs in, we merge their localStorage cart into
 * the server cart so they don't lose items they added anonymously.
 *
 * The components using useCartContext() don't need to know which
 * system is active — they always get the same interface:
 *   { items, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart }
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCartActions } from '../hooks/useServerCart'
import { TokenStorage } from '../api/client'
import { addToCart } from '../api/cart'

const CartContext = createContext(null)

// ── localStorage cart (not logged in) ────────────────────────────────────
function useLocalCart() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('techvault_cart') || '[]')
    } catch { return [] }
  })

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

  function clearItems() { setItems([]) }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0).toFixed(2)

  return { items, totalItems, totalPrice, addItem, removeItem, updateQty, clearItems }
}

// ── Provider ─────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const loggedIn    = !!TokenStorage.getAccess()
  const serverCart  = useCartActions()
  const localCart   = useLocalCart()
  const queryClient = useQueryClient()

  // When user logs in, migrate any localStorage items to the server cart
  useEffect(() => {
    async function migrateLocalCart() {
      if (!loggedIn || localCart.items.length === 0) return
      try {
        for (const item of localCart.items) {
          await addToCart(item.id, item.qty)
        }
        localCart.clearItems()
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      } catch (err) {
        console.error('Cart migration failed:', err)
      }
    }
    migrateLocalCart()
  }, [loggedIn])

  // Unified interface — same shape regardless of which cart is active
  const cart = loggedIn
    ? {
        // Server cart — items come from Django
        items: serverCart.items.map(item => ({
          id:          item.product.id,
          name:        item.product.name,
          price:       item.product.price,
          price_old:   item.product.price_old,
          image:       item.product.image,
          vendorName:  item.product.vendor_name,
          // Keep item_id separate so we can PATCH/DELETE by cart item ID
          cartItemId:  item.id,
          qty:         item.quantity,
          lineTotal:   item.line_total,
        })),
        totalItems:  serverCart.totalItems,
        totalPrice:  serverCart.totalPrice,
        isLoading:   serverCart.isLoading,
        addItem:     (product, qty = 1) => serverCart.addItem(product.id, qty),
        removeItem:  (cartItemId) => serverCart.removeItem(cartItemId),
        updateQty:   (cartItemId, qty) => serverCart.updateItem(cartItemId, qty),
        clearCart:   serverCart.clearItems,
        isAdding:    serverCart.isAdding,
        addError:    serverCart.addError,
      }
    : {
        // Local cart — items from localStorage
        items:      localCart.items,
        totalItems: localCart.totalItems,
        totalPrice: localCart.totalPrice,
        isLoading:  false,
        addItem:    localCart.addItem,
        removeItem: localCart.removeItem,
        updateQty:  localCart.updateQty,
        clearCart:  localCart.clearItems,
        isAdding:   false,
        addError:   null,
      }

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used inside <CartProvider>')
  return ctx
}