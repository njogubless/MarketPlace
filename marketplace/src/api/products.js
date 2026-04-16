/**
 * api/products.js
 *
 * LESSON: The API layer
 * This file contains ALL functions that fetch product data.
 * Components never fetch directly — they call these functions.
 *
 * Right now these functions return mock data with a fake delay
 * to simulate a real network request. Later you'll replace
 * `return mockData` with `return await fetch('/api/products')`.
 * Your components won't need to change at all.
 *
 * The fake delay (setTimeout) is important for learning:
 * it lets you see loading states, which is a core React/TanStack concept.
 */

import { PRODUCTS, CATEGORIES } from './mockData.js'

// Simulates network latency so we can see loading states
const delay = (ms = 600) => new Promise(res => setTimeout(res, ms))

/**
 * Fetch all products, with optional filtering
 * @param {Object} filters - { category, search, sort }
 * @returns {Promise<Product[]>}
 */
export async function fetchProducts({ category = 'all', search = '', sort = 'featured' } = {}) {
  await delay()

  let results = [...PRODUCTS]

  // Filter by category
  if (category && category !== 'all') {
    results = results.filter(p => p.category === category)
  }

  // Filter by search term
  if (search) {
    const q = search.toLowerCase()
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.vendorHandle.toLowerCase().includes(q) ||
      p.category.includes(q)
    )
  }

  // Sort
  switch (sort) {
    case 'price-asc':  results.sort((a,b) => a.price - b.price);   break
    case 'price-desc': results.sort((a,b) => b.price - a.price);   break
    case 'rating':     results.sort((a,b) => b.rating - a.rating); break
    case 'featured':   results.sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
    default: break
  }

  return results
}

/**
 * Fetch a single product by ID
 * @param {string} id
 * @returns {Promise<Product>}
 */
export async function fetchProductById(id) {
  await delay(400)
  const product = PRODUCTS.find(p => p.id === id)
  if (!product) throw new Error(`Product ${id} not found`)
  return product
}

/**
 * Fetch all categories
 */
export async function fetchCategories() {
  await delay(200)
  return CATEGORIES
}