/**
 * hooks/useVendors.js
 *
 * LESSON: Pattern repetition
 * Notice how similar this is to useProducts.js — same pattern:
 * queryKey + queryFn + options. This is intentional.
 * Once you understand the pattern once, you can apply it anywhere.
 */

import { useQuery } from '@tanstack/react-query'
import { fetchVendors, fetchVendorById } from '../api/vendors.js'

export function useVendors(filters = {}) {
  return useQuery({
    queryKey: ['vendors', filters],
    queryFn: () => fetchVendors(filters),
    staleTime: 1000 * 60 * 3,
  })
}

export function useVendor(id) {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: () => fetchVendorById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}