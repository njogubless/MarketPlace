/**
 * VendorDetailPage.jsx — mirrors the HTML vendor-details page
 * Same pattern as ProductDetailPage: useParams → useVendor → render
 */
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useVendor } from '../hooks/useVendors.js'
import { PRODUCTS } from '../api/mockData.js'
import StarRating from '../components/ui/StarRating.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import { useCartContext } from '../context/CartContext.jsx'

const STAT_KEYS = ['processingSpeed','communication','shippingSpeed','packaging','productQuality']
const STAT_LABELS = { processingSpeed:'Processing Speed', communication:'Communication', shippingSpeed:'Shipping Speed', packaging:'Packaging', productQuality:'Product Quality' }

export default function VendorDetailPage() {
  const { id } = useParams()
  const { data: vendor, isLoading, isError } = useVendor(id)
  const { addItem } = useCartContext()
  const [activeTab, setActiveTab] = useState('overview')

  if (isLoading) return <LoadingSpinner message="Loading vendor..." />
  if (isError || !vendor) return <ErrorMessage message="Vendor not found." />

  const vendorProducts = PRODUCTS.filter(p => p.vendorId === id)
  const avg = (Object.values(vendor.stats).reduce((a,b)=>a+b,0) / Object.values(vendor.stats).length).toFixed(2)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <i className="fas fa-chevron-right text-[10px]" />
        <Link to="/vendors" className="hover:text-white transition">Vendors</Link>
        <i className="fas fa-chevron-right text-[10px]" />
        <span className="text-cyan-400">{vendor.handle}</span>
      </nav>

      {/* Vendor header */}
      <div className="card-glow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className={`h-24 w-24 rounded-2xl bg-gradient-to-br ${vendor.gradient} flex items-center justify-center text-3xl font-bold text-white font-display flex-shrink-0`}>
            {vendor.initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="display-title text-3xl">{vendor.handle}</h1>
              {vendor.verified && <span className="badge-green"><i className="fas fa-check" /> Verified</span>}
              {vendor.express && <span className="badge-gold"><i className="fas fa-bolt" /> Express</span>}
              <span className="badge-cyan"><i className="fas fa-circle text-[8px] text-emerald-400" /> Active</span>
            </div>
            <StarRating rating={vendor.rating} count={vendor.reviews} size="lg" />
            <p className="text-gray-400 text-sm mt-3 max-w-2xl">{vendor.bio}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              {[{l:'Member Since',v:vendor.memberSince},{l:'Total Sales',v:vendor.sales.toLocaleString()},{l:'Satisfaction',v:`${vendor.satisfaction}%`},{l:'Ships From',v:vendor.shipsFrom}].map(({l,v})=>(
                <div key={l} className="bg-void-700/60 rounded-xl p-3 border border-void-600">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">{l}</p>
                  <p className="text-sm font-medium text-white mt-1">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 md:flex-col">
            <button className="btn-primary text-sm"><i className="fas fa-store" /> View Products</button>
            <button className="btn-secondary text-sm"><i className="fas fa-heart" /> Follow</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-void-600 mb-0">
        {['overview','products','ratings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${activeTab===tab?'text-cyan-400 border-cyan-400':'text-gray-500 border-transparent hover:text-white'}`}>
            {tab === 'products' ? `Products (${vendorProducts.length})` : tab}
          </button>
        ))}
      </div>

      <div className="card-glow rounded-t-none p-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="section-title mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.specialties.map(s=>(
                  <span key={s} className="badge-purple">{s}</span>
                ))}
              </div>
              <h3 className="section-title mt-6 mb-4">Delivery</h3>
              <p className="text-sm text-gray-400">{vendor.deliveryTime}</p>
            </div>
            <div>
              <h3 className="section-title mb-4">Quick Stats</h3>
              <div className="space-y-1 text-sm">
                {[{l:'Total Reviews',v:vendor.reviews.toLocaleString()},{l:'Successful Sales',v:vendor.sales.toLocaleString()},{l:'Overall Rating',v:`${vendor.rating}/5.00`}].map(({l,v})=>(
                  <div key={l} className="flex justify-between py-2 border-b border-void-700">
                    <span className="text-gray-400">{l}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          vendorProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">No products listed yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vendorProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addItem} />)}
            </div>
          )
        )}

        {activeTab === 'ratings' && (
          <div className="max-w-md">
            <h3 className="section-title mb-5">Ratings Breakdown</h3>
            <div className="space-y-4">
              {STAT_KEYS.map(key => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">{STAT_LABELS[key]}</span>
                    <span className="font-medium text-white">{vendor.stats[key]}</span>
                  </div>
                  <div className="h-2 rounded-full bg-void-600 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-neon-purple to-cyan-400 transition-all duration-700"
                      style={{ width: `${(vendor.stats[key] / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t border-void-700">
                <span className="font-display font-semibold text-white">Average Rating</span>
                <span className="font-display font-bold text-2xl text-amber-400">{avg}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}