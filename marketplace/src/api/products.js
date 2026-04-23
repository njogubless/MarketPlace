/**
 * src/api/products.js
 *
 * LESSON: Real API calls replacing mockData
 * Your hooks (useProducts, useProduct) stay identical.
 * Only this file changes — from reading a JS array to calling Django.
 *
 * DRF pagination wraps results like:
 * { count: 20, next: "?page=2", previous: null, results: [...] }
 * We return data.results so components get a plain array.
 */

import apiClient from './client'

// Maps the frontend sort labels to Django ordering params
const SORT_MAP = {
  'featured':   '-is_featured',
  'price-asc':  'price',
  'price-desc': '-price',
  'rating':     '-average_rating',
  'newest':     '-created_at',
}

export async function fetchProducts({ category, search, sort, page } = {}) {
  const params = {}
  if (category && category !== 'all') params.category = category
  if (search)                         params.search   = search
  if (sort && SORT_MAP[sort])         params.ordering = SORT_MAP[sort]
  if (page)                           params.page     = page

  const { data } = await apiClient.get('products/', { params })
  return data.results ?? data
}

export async function fetchProductById(id) {
  const { data } = await apiClient.get(`products/${id}/`)
  return data
}

export async function fetchCategories() {
  const { data } = await apiClient.get('products/categories/')
  return data.results ?? data
}

export async function fetchFeaturedProducts() {
  const { data } = await apiClient.get('products/featured/')
  return data
}