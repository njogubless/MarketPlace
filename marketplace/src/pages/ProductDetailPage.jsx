/**
 * ProductDetailPage.jsx
 *
 * LESSON: Dynamic URL params with useParams
 *
 * URL: /products/p1  → useParams() gives { id: 'p1' }
 * URL: /products/p3  → useParams() gives { id: 'p3' }
 *
 * We pass this id to useProduct(id), which passes it to the API.
 * The queryKey is ['product', 'p1'] — cached separately per product.
 * Navigate between products? TanStack shows the cached one immediately.
 */

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts.js'
import { useCartContext } from '../context/CartContext.jsx'
import StarRating from '../components/ui/StarRating.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import { REVIEWS, VENDORS } from '../api/mockData.js'

export default function ProductDetailPage() {
  const { id } = useParams()  // reads the :id from the URL
  const { data: product, isLoading, isError } = useProduct(id)
  const { addItem, items } = useCartContext()
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('details')
  const [added, setAdded] = useState(false)

  if (isLoading) return <LoadingSpinner message="Loading product..." />
  if (isError || !product) return <ErrorMessage message="Product not found." />

  const vendor   = VENDORS.find(v => v.id === product.vendorId)
  const reviews  = REVIEWS[id] || []
  const inCart   = items.some(i => i.id === id)
  const discount = product.priceOld ? Math.round((1 - product.price / product.priceOld) * 100) : null

  function handleAddToCart() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const TABS = ['details', 'specs', 'reviews', 'vendor']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <i className="fas fa-chevron-right text-[10px]" />
        <Link to="/products" className="hover:text-white transition">Products</Link>
        <i className="fas fa-chevron-right text-[10px]" />
        <Link to={`/products?cat=${product.category}`} className="hover:text-white transition capitalize">{product.category}</Link>
        <i className="fas fa-chevron-right text-[10px]" />
        <span className="text-cyan-400 truncate">{product.name}</span>
      </nav>

      {/* Main product section */}
      <div className="card-glow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="md:w-1/2">
            <div className="relative bg-gradient-to-br from-void-700 to-void-800 rounded-xl h-80 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-cyan-500/5" />
              <i className={`fas ${product.icon} text-8xl ${product.iconColor} opacity-30`} />
              {product.badge && (
                <span className="absolute top-4 left-4 badge-gold">
                  <i className="fas fa-trophy text-[10px]" /> {product.badge}
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-void-900/60 flex items-center justify-center rounded-xl">
                  <span className="badge-red text-sm px-4 py-2">Out of Stock</span>
                </div>
              )}
              {discount && (
                <span className="absolute top-4 right-4 badge-green">-{discount}%</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <div>
              <p className="text-xs text-gray-500 font-mono mb-1">
                <i className="fas fa-store mr-1 text-neon-purple/70" />
                <Link to={`/vendors/${product.vendorId}`} className="hover:text-cyan-400 transition">{product.vendorHandle}</Link>
                <span className="mx-2">·</span>
                <span className="capitalize">{product.category}</span>
              </p>
              <h1 className="display-title text-2xl md:text-3xl">{product.name}</h1>
            </div>

            <StarRating rating={product.rating} count={product.reviewCount} size="lg" />

            <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="display-title text-3xl">${product.price.toLocaleString()}</span>
              {product.priceOld && <span className="text-gray-500 line-through text-lg">${product.priceOld.toLocaleString()}</span>}
              {discount && <span className="badge-green">Save {discount}%</span>}
            </div>

            {/* Qty + Add to Cart */}
            {product.inStock ? (
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-void-600 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 bg-void-700 hover:bg-void-600 text-gray-300 transition flex items-center justify-center">
                    <i className="fas fa-minus text-xs" />
                  </button>
                  <span className="w-10 text-center text-white font-medium font-mono">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-10 h-11 bg-void-700 hover:bg-void-600 text-gray-300 transition flex items-center justify-center">
                    <i className="fas fa-plus text-xs" />
                  </button>
                </div>

                <button onClick={handleAddToCart} className={`btn-primary flex-1 justify-center py-3 transition-all ${added ? 'from-emerald-600 to-emerald-700' : ''}`}>
                  <i className={`fas ${added ? 'fa-check' : 'fa-bag-shopping'}`} />
                  {added ? 'Added!' : inCart ? 'Add More' : 'Add to Cart'}
                </button>

                <button className="btn-secondary px-3 py-3">
                  <i className="fas fa-heart" />
                </button>
              </div>
            ) : (
              <div className="badge-red px-4 py-3 rounded-xl text-sm">
                <i className="fas fa-clock mr-2" /> Currently out of stock — join the waitlist
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-void-700">
              <i className="fas fa-shield-check text-emerald-400" /> Verified seller
              <span>·</span>
              <i className="fas fa-rotate-left text-cyan-400" /> 30-day returns
              <span>·</span>
              <i className="fas fa-lock text-violet-400" /> Secure checkout
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-void-600 mb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-cyan-400 border-cyan-400'
                : 'text-gray-500 border-transparent hover:text-white'
            }`}
          >
            {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
          </button>
        ))}
      </div>

      <div className="card-glow rounded-t-none p-6 mb-6">
        {/* Details tab */}
        {activeTab === 'details' && (
          <div>
            <h3 className="section-title mb-3">About this product</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{product.description}</p>
          </div>
        )}

        {/* Specs tab */}
        {activeTab === 'specs' && (
          <div>
            <h3 className="section-title mb-4">Specifications</h3>
            <div className="divide-y divide-void-600">
              {Object.entries(product.specs || {}).map(([key, val]) => (
                <div key={key} className="flex py-3 text-sm">
                  <span className="text-gray-500 w-36 flex-shrink-0">{key}</span>
                  <span className="text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          <div>
            <h3 className="section-title mb-5">Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(r => (
                  <div key={r.id} className="bg-void-700/60 rounded-xl p-4 border border-void-600 hover:border-neon-purple/30 transition">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                        {r.initials}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{r.user}</p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={r.rating} />
                          <span className="text-[10px] text-gray-500">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium text-white text-sm mb-1">{r.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{r.body}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                      <button className="hover:text-white transition"><i className="fas fa-thumbs-up mr-1" />{r.likes}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vendor tab */}
        {activeTab === 'vendor' && vendor && (
          <div>
            <h3 className="section-title mb-5">About {vendor.handle}</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-3 md:w-48">
                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${vendor.gradient} flex items-center justify-center text-2xl font-bold text-white font-display`}>
                  {vendor.initials}
                </div>
                <div className="text-center">
                  <p className="font-display font-semibold text-white">{vendor.handle}</p>
                  <StarRating rating={vendor.rating} count={vendor.reviews} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-4">{vendor.bio}</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{l:'Total Sales',v:vendor.sales.toLocaleString()},{l:'Satisfaction',v:`${vendor.satisfaction}%`},{l:'Ships From',v:vendor.shipsFrom}].map(({l,v})=>(
                    <div key={l} className="bg-void-700/60 rounded-lg p-3 border border-void-600">
                      <p className="text-[10px] text-gray-500 uppercase">{l}</p>
                      <p className="text-sm font-medium text-white mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                <Link to={`/vendors/${vendor.id}`} className="btn-cyan text-sm">
                  <i className="fas fa-store" /> Visit Store
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}