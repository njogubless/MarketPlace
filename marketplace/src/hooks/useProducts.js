/**
 * hooks/useProducts.js
 *
 * LESSON: Custom hooks with TanStack Query
 *
 * A "hook" is a React function starting with "use" that can hold state or logic.
 * Custom hooks let us package up complex logic and reuse it across components.
 *
 * useQuery() from TanStack Query gives us:
 *   data      — the actual result from our API function
 *   isLoading — true while the first fetch is happening
 *   isFetching — true whenever a fetch is in progress (including background)
 *   isError   — true if the fetch threw an error
 *   error     — the actual error object
 *   refetch   — function to manually trigger a new fetch
 *
 * queryKey is CRITICAL — it's like an address for cached data.
 * ['products', { category, search }] means:
 *   "cache this data under this exact combination of values"
 * If category changes, TanStack auto-fetches the new category's data.
 *
 * staleTime controls when data is considered "stale" (needs refetch).
 * Once stale, TanStack refetches in the background — the user still sees
 * old data instantly while fresh data loads. No spinner needed.
 */

import { useQuery } from '@tanstack/react-query'
import { fetchProducts, fetchProductById, fetchCategories } from '../api/products.js'

// Hook for the products listing page
export function useProducts(filters = {}) {
  return useQuery({
    // queryKey includes filters so different filter combos are cached separately
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh
  })
}

// Hook for a single product's detail page
export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id, // only run if id is truthy
    staleTime: 1000 * 60 * 5,
  })
}

// Hook for the category sidebar list
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity, // categories never change — cache forever
  })
}