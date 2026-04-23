/**
 * src/pages/CartPage.jsx
 *
 * LESSON: This page uses only local state from CartContext.
 * No TanStack Query needed — cart data is already in memory.
 * useMemo caches the calculated totals so they only recompute when items change.
 */

import { useMemo } from 'react'
import { Link }    from 'react-router-dom'
import { useCartContext } from '../context/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalItems } = useCartContext()

  // useMemo — only recalculates when items changes, not on every render
  const { subtotal, savings, tax, shipping, total } = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)
    const savings  = items.reduce((sum, i) => {
      if (i.price_old) return sum + (Number(i.price_old) - Number(i.price)) * i.qty
      return sum
    }, 0)
    const shipping = subtotal >= 100 ? 0 : 9.99
    const tax      = subtotal * 0.08
    const total    = subtotal + shipping + tax
    return { subtotal, savings, tax, shipping, total }
  }, [items])

  // ── Empty cart state ───────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="display-title text-3xl mb-10">Your Cart</h1>
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-20 h-20 rounded-2xl bg-void-800 border border-void-600 flex items-center justify-center">
            <i className="fas fa-bag-shopping text-3xl text-gray-600" />
          </div>
          <div className="text-center">
            <h2 className="font-display font-semibold text-white text-xl mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              Looks like you haven't added anything yet. Browse our products and find something you'll love.
            </p>
          </div>
          <Link to="/products" className="btn-primary">
            <i className="fas fa-boxes-stacked" /> Browse Products
          </Link>
        </div>
      </div>
    )
  }

  // ── Filled cart ────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-title text-3xl">Your Cart</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="btn-secondary text-xs text-red-400 hover:text-red-300"
        >
          <i className="fas fa-trash" /> Clear cart
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Left: Cart items list ── */}
        <div className="flex-1 space-y-3">
          {items.map(item => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQty={updateQty}
              onRemove={removeItem}
            />
          ))}

          <div className="pt-4">
            <Link to="/products" className="btn-secondary text-sm">
              <i className="fas fa-arrow-left" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Right: Order summary ── */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="card-glow p-6 sticky top-20">
            <h2 className="section-title mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>

              {/* Only show savings row if user is saving something */}
              {savings > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>You save</span>
                  <span>-${savings.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-400' : 'text-white'}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Tax (8%)</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>

              {/* Free shipping progress bar */}
              {subtotal < 100 && (
                <div className="bg-cyan-900/20 border border-cyan-800/40 rounded-xl p-3 text-xs text-cyan-400">
                  <i className="fas fa-truck-fast mr-1" />
                  Add <strong>${(100 - subtotal).toFixed(2)}</strong> more for free shipping
                  <div className="mt-2 h-1.5 bg-void-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-purple to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-void-600 pt-3 flex justify-between items-center">
                <span className="font-display font-semibold text-white">Total</span>
                <span className="font-display font-bold text-xl text-white">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout button */}
            <button className="btn-primary w-full justify-center py-3.5 mt-6">
              <i className="fas fa-lock text-xs" /> Proceed to Checkout
            </button>

            {/* Payment method icons */}
            <div className="mt-4 flex items-center justify-center gap-3 text-gray-600 text-xl">
              <i className="fab fa-cc-visa" />
              <i className="fab fa-cc-mastercard" />
              <i className="fab fa-cc-paypal" />
              <i className="fab fa-cc-apple-pay" />
            </div>

            {/* Trust badges */}
            <div className="mt-4 pt-4 border-t border-void-700 space-y-2">
              {[
                { icon: 'fa-shield-check', color: 'text-emerald-400', text: 'Secure checkout' },
                { icon: 'fa-rotate-left',  color: 'text-cyan-400',    text: '30-day returns' },
                { icon: 'fa-truck-fast',   color: 'text-violet-400',  text: 'Free shipping over $100' },
              ].map(({ icon, color, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                  <i className={`fas ${icon} ${color}`} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ── CartItemRow — extracted as its own component inside this file ──────────
//
// LESSON: Small components used only in one place live in the same file.
// No need to create a separate file for every tiny piece of UI.
// Only extract to a separate file when a component is reused elsewhere.

function CartItemRow({ item, onUpdateQty, onRemove }) {
  const lineTotal  = Number(item.price) * item.qty
  const lineSaving = item.price_old
    ? (Number(item.price_old) - Number(item.price)) * item.qty
    : 0

  return (
    <div className="card p-4 flex flex-col sm:flex-row gap-4 group">

      {/* Product icon / image */}
      <Link to={`/products/${item.id}`} className="flex-shrink-0">
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-void-700 to-void-800 flex items-center justify-center border border-void-600 group-hover:border-neon-purple/30 transition-colors">
          <i className={`fas ${item.icon ?? 'fa-box'} text-2xl ${item.iconColor ?? 'text-gray-400'} opacity-70`} />
        </div>
      </Link>

      {/* Product details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/products/${item.id}`}>
              <h3 className="font-display font-semibold text-white text-sm leading-snug hover:text-cyan-300 transition-colors line-clamp-2">
                {item.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">
              <i className="fas fa-store mr-1 text-neon-purple/60" />
              {item.vendor?.shop_name ?? item.vendorHandle ?? 'Unknown Vendor'}
            </p>
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 w-7 h-7 rounded-lg bg-void-700 hover:bg-red-900/40 border border-void-600 hover:border-red-800/60 flex items-center justify-center transition-all text-gray-500 hover:text-red-400"
            title="Remove item"
          >
            <i className="fas fa-xmark text-xs" />
          </button>
        </div>

        {/* Quantity + line total */}
        <div className="flex items-center justify-between mt-3">

          {/* Quantity controls */}
          <div className="flex items-center border border-void-600 rounded-xl overflow-hidden">
            <button
              onClick={() => onUpdateQty(item.id, item.qty - 1)}
              className="w-8 h-8 bg-void-700 hover:bg-void-600 text-gray-400 hover:text-white transition flex items-center justify-center"
            >
              <i className="fas fa-minus text-xs" />
            </button>
            <span className="w-8 text-center text-white text-sm font-mono font-medium">
              {item.qty}
            </span>
            <button
              onClick={() => onUpdateQty(item.id, item.qty + 1)}
              className="w-8 h-8 bg-void-700 hover:bg-void-600 text-gray-400 hover:text-white transition flex items-center justify-center"
            >
              <i className="fas fa-plus text-xs" />
            </button>
          </div>

          {/* Line price */}
          <div className="text-right">
            <p className="font-display font-bold text-white">${lineTotal.toFixed(2)}</p>
            {lineSaving > 0 && (
              <p className="text-[10px] text-emerald-400">saving ${lineSaving.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}