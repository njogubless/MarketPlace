/**
 * src/hooks/useServerCart.js
 *
 * LESSON: useQuery vs useMutation recap
 *
 * useQuery    → for READING data (GET requests)
 *   - runs automatically when component mounts
 *   - caches the result
 *   - refetches when stale
 *
 * useMutation → for CHANGING data (POST, PATCH, DELETE)
 *   - does NOT run automatically
 *   - you call mutate() or mutateAsync() to trigger it
 *   - has onSuccess, onError callbacks
 *
 * After every mutation that changes the cart, we call:
 *   queryClient.invalidateQueries({ queryKey: ['cart'] })
 * This tells TanStack the cached cart is stale → refetch immediately.
 * The UI updates automatically. We never manually update state.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkout,
  fetchOrders,
  fetchOrderById,
} from '../api/cart'
import { TokenStorage } from '../api/client'

const loggedIn = () => !!TokenStorage.getAccess()

// ── Cart queries ──────────────────────────────────────────────────────────────

export function useCart() {
  return useQuery({
    queryKey:  ['cart'],
    queryFn:   fetchCart,
    enabled:   loggedIn(),
    staleTime: 1000 * 30,   // 30 seconds
    retry:     false,
  })
}

// ── Cart mutations ────────────────────────────────────────────────────────────

export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, quantity = 1 }) => addToCart(productId, quantity),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, quantity),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId) => removeCartItem(itemId),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: clearCart,
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}

// ── Checkout mutation ─────────────────────────────────────────────────────────

export function useCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ address, notes }) => checkout({ address, notes }),
    onSuccess: () => {
      // Cart is now empty — invalidate both cart and orders cache
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

// ── Order queries ─────────────────────────────────────────────────────────────

export function useOrders() {
  return useQuery({
    queryKey:  ['orders'],
    queryFn:   fetchOrders,
    enabled:   loggedIn(),
    staleTime: 1000 * 60 * 2,
  })
}

export function useOrder(orderId) {
  return useQuery({
    queryKey:  ['order', orderId],
    queryFn:   () => fetchOrderById(orderId),
    enabled:   !!orderId && loggedIn(),
    staleTime: 1000 * 60 * 5,
  })
}

// ── Combined hook — everything the UI needs ───────────────────────────────────

export function useCartActions() {
  const { data: cart, isLoading } = useCart()
  const addMutation    = useAddToCart()
  const updateMutation = useUpdateCartItem()
  const removeMutation = useRemoveCartItem()
  const clearMutation  = useClearCart()

  return {
    cart,
    isLoading,
    items:      cart?.items       ?? [],
    totalItems: cart?.total_items ?? 0,
    totalPrice: cart?.total       ?? '0.00',

    addItem:    (productId, quantity = 1) =>
      addMutation.mutateAsync({ productId, quantity }),
    updateItem: (itemId, quantity) =>
      updateMutation.mutateAsync({ itemId, quantity }),
    removeItem: (itemId) =>
      removeMutation.mutateAsync(itemId),
    clearItems: () =>
      clearMutation.mutateAsync(),

    isAdding:   addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
    addError:   addMutation.error,
  }
}