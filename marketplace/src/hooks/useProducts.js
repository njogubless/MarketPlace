/**
 * src/hooks/useProducts.js
 *
 * LESSON: These hooks are completely unchanged from before.
 * The only difference is api/products.js now calls Django
 * instead of reading mockData. TanStack Query does not care
 * where the data comes from — it just calls the function.
 */

import { useQuery } from '@tanstack/react-query'
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  fetchFeaturedProducts,
} from '../api/products'

export function useProducts(filters = {}) {
  return useQuery({
    queryKey:  ['products', filters],
    queryFn:   () => fetchProducts(filters),
    staleTime: 1000 * 60 * 2,
  })
}

export function useProduct(id) {
  return useQuery({
    queryKey:  ['product', id],
    queryFn:   () => fetchProductById(id),
    enabled:   !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCategories() {
  return useQuery({
    queryKey:  ['categories'],
    queryFn:   fetchCategories,
    staleTime: Infinity,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey:  ['products', 'featured'],
    queryFn:   fetchFeaturedProducts,
    staleTime: 1000 * 60 * 5,
  })
}