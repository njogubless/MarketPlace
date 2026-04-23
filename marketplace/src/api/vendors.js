/**
 * src/api/vendors.js
 * Matched to YOUR Vendor model: shop_name, handle, is_verified, location, stats
 */

import apiClient from './client'

const SORT_MAP = {
  'rating':  '-stats__avg_rating',
  'sales':   '-stats__total_sales',
  'reviews': '-stats__total_reviews',
  'newest':  '-created_at',
}

export async function fetchVendors({ search, sort } = {}) {
  const params = {}
  if (search)                 params.search   = search
  if (sort && SORT_MAP[sort]) params.ordering = SORT_MAP[sort]

  const { data } = await apiClient.get('vendors/', { params })
  return data.results ?? data
}

export async function fetchVendorById(id) {
  const { data } = await apiClient.get(`vendors/${id}/`)
  return data
}