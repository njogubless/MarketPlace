/**
 * ProductsPage.jsx
 *
 * LESSON: Controlled inputs + derived state
 *
 * useState manages the filter values (category, search, sort).
 * Every time a filter changes, useProducts re-runs with new params.
 * TanStack Query caches each unique combination separately.
 * So if you switch category → switch back, TanStack shows cached data instantly.
 *
 * useSearchParams is React Router's way to sync state with the URL.
 * e.g. /products?cat=audio — so users can share filtered URLs.
 */

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useCategories } from '../hooks/useProducts.js'
import { useCartContext } from '../context/CartContext.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
]

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const [search,   setSearch]   = useState('')
  const [sort,     setSort]     = useState('featured')
  const [category, setCategory] = useState(searchParams.get('cat') || 'all')

  const { data: categories } = useCategories()
  const { data: products, isLoading, isError, error, refetch } = useProducts({ category, search, sort })
  const { addItem } = useCartContext()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="display-title text-3xl">Products</h1>
        <p className="text-gray-500 text-sm mt-1">
          {products ? `${products.length} products found` : 'Loading...'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar ── */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="card p-4 sticky top-20">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              <i className="fas fa-layer-group mr-2 text-neon-purple" />Categories
            </h3>
            <ul className="space-y-0.5">
              {categories?.map(cat => (
                <li key={cat.id}>
                  {/**
                   * LESSON: Conditional className
                   * We use a ternary expression to toggle active styles.
                   * This is the React way to do what HTML does with classList.
                   */}
                  <button
                    onClick={() => setCategory(cat.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left ${
                      category === cat.id
                        ? 'bg-violet-900/40 text-violet-300 border-l-2 border-neon-purple'
                        : 'text-gray-400 hover:text-white hover:bg-void-700 border-l-2 border-transparent'
                    }`}
                  >
                    <i className={`fas ${cat.icon} text-xs w-4 text-center`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Search + Sort bar */}
          <div className="card p-3 mb-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <i className="fas fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="text"
                placeholder="Search products, vendors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 py-2.5 text-sm"
              />
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input py-2.5 text-sm w-full sm:w-52 bg-void-700"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Results */}
          {isLoading ? (
            <LoadingSpinner message="Fetching products..." />
          ) : isError ? (
            <ErrorMessage message={error?.message} onRetry={refetch} />
          ) : products?.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <i className="fas fa-box-open text-4xl mb-4 block text-void-600" />
              No products match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}