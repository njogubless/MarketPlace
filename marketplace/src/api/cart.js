/**
 * src/api/cart.js
 *
 * All cart and order API functions.
 * These are called by hooks — never directly by components.
 *
 * Cart endpoints   → /api/orders/cart/...
 * Order endpoints  → /api/orders/checkout/ and /api/orders/
 */

import apiClient from './client'

// ── Cart ──────────────────────────────────────────────────────────────────────

export async function fetchCart() {
  const { data } = await apiClient.get('orders/cart/')
  return data
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await apiClient.post('orders/cart/items/', {
    product_id: productId,
    quantity,
  })
  return data
}

export async function updateCartItem(itemId, quantity) {
  const { data } = await apiClient.patch(`orders/cart/items/${itemId}/`, { quantity })
  return data
}

export async function removeCartItem(itemId) {
  await apiClient.delete(`orders/cart/items/${itemId}/`)
}

export async function clearCart() {
  await apiClient.delete('orders/cart/clear/')
}

// ── Orders ────────────────────────────────────────────────────────────────────

/**
 * Place an order from the current cart.
 * @param {string} address - shipping address
 * @param {string} notes   - optional order notes
 */
export async function checkout({ address = '', notes = '' } = {}) {
  const { data } = await apiClient.post('orders/checkout/', { address, notes })
  return data
}

export async function fetchOrders() {
  const { data } = await apiClient.get('orders/')
  return data
}

export async function fetchOrderById(orderId) {
  const { data } = await apiClient.get(`orders/${orderId}/`)
  return data
}