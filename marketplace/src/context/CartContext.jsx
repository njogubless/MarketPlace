/**
 * context/CartContext.jsx
 *
 * LESSON: React Context — sharing state without "prop drilling"
 *
 * Problem without Context:
 *   App → Navbar (needs cart count)
 *   App → ProductsPage → ProductCard → AddToCart button (also needs cart)
 *   You'd have to pass cart down through EVERY level. This is "prop drilling" — painful.
 *
 * Solution: Context
 *   1. Create a context (createContext)
 *   2. Wrap the app in a Provider with the data
 *   3. Any component anywhere can call useContext() to read the data
 *
 * Think of it like a global variable, but React-aware (rerenders happen correctly).
 */

import { createContext, useContext } from 'react'
import { useCart } from '../hooks/useCart.js'

// Step 1: Create the context (like creating a "channel")
const CartContext = createContext(null)

// Step 2: The Provider wraps the app and broadcasts cart data to all children
export function CartProvider({ children }) {
  const cart = useCart() // all the cart logic lives in the hook
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

// Step 3: Custom hook so components can subscribe to cart changes
// Usage: const { items, addItem, totalItems } = useCartContext()
export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used inside <CartProvider>')
  return ctx
}