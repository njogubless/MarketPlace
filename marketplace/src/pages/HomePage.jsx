/**
 * HomePage.jsx
 *
 * LESSON: Page components
 * A page component is just a regular React component that represents a whole page.
 * It can import and compose smaller components, and use hooks to fetch data.
 * 
 * useProducts() returns { data, isLoading, isError } from TanStack Query.
 * We pass data down to child components as props.
 */

import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts.js'
import { useCartContext } from '../context/CartContext.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

const HERO_STATS = [
  { value: '50K+', label: 'Products Listed' },
  { value: '1.2K', label: 'Verified Vendors' },
  { value: '4.9★', label: 'Avg. Rating' },
  { value: '99%',  label: 'Satisfaction Rate' },
]

const FEATURE_CARDS = [
  { icon: 'fa-shield-check', color: 'text-emerald-400', bg: 'bg-emerald-900/20', title: 'Verified Sellers', desc: 'Every vendor is identity-verified and reviewed by our trust & safety team.' },
  { icon: 'fa-truck-fast',   color: 'text-cyan-400',    bg: 'bg-cyan-900/20',    title: 'Fast Shipping',   desc: 'Global shipping with real-time tracking on all physical products.' },
  { icon: 'fa-rotate-left',  color: 'text-violet-400',  bg: 'bg-violet-900/20',  title: '30-Day Returns',  desc: 'Changed your mind? Return any item within 30 days, no questions asked.' },
  { icon: 'fa-lock',         color: 'text-amber-400',   bg: 'bg-amber-900/20',   title: 'Secure Payments', desc: 'Stripe-secured checkout. Cards, PayPal, and crypto accepted.' },
]

export default function HomePage() {
  // useProducts with { featured: true } — fetches only featured items
  const { data: featuredProducts, isLoading } = useProducts({ sort: 'featured' })
  const { addItem } = useCartContext()

  function handleAddToCart(product) {
    addItem(product)
    // toast feedback would go here — we'll add that later
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.8) 1px, transparent 1px), linear-gradient(90deg,rgba(124,58,237,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Orbs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-neon-purple/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-cyan-500/8 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 badge-purple mb-6 text-xs">
            <i className="fas fa-bolt text-amber-400" /> New arrivals every week
          </div>

          <h1 className="display-title text-5xl md:text-6xl lg:text-7xl mb-6 leading-none">
            The Future of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-cyan-400 to-emerald-400">
              Tech Commerce
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover laptops, software, audio gear, gaming hardware, and more — from verified vendors worldwide. Guaranteed quality, fast shipping.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="btn-primary text-base px-8 py-3.5">
              <i className="fas fa-rocket" /> Browse Products
            </Link>
            <Link to="/vendors" className="btn-secondary text-base px-8 py-3.5">
              <i className="fas fa-store" /> Meet Vendors
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto">
            {HERO_STATS.map(({ value, label }) => (
              <div key={label} className="card p-4 text-center">
                <p className="font-display font-bold text-2xl text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-1">Hand-picked by our team this week</p>
          </div>
          <Link to="/products" className="btn-secondary text-xs">
            View All <i className="fas fa-arrow-right" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading featured products..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* .slice(0,4) takes only the first 4 items from the array */}
            {featuredProducts?.slice(0, 4).map(product => (
              /**
               * LESSON: The .map() pattern
               * This is how React renders lists. For each item in the array,
               * we return a component. The `key` prop is REQUIRED — React uses
               * it to track which items change/move/are removed efficiently.
               */
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Features ── */}
      <section className="border-t border-void-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title text-center mb-10">Why TechVault?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURE_CARDS.map(({ icon, color, bg, title, desc }) => (
              <div key={title} className="card p-5 flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <i className={`fas ${icon} ${color}`} />
                </div>
                <h3 className="font-display font-semibold text-white text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="card-glow p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-cyan-500/5" />
          <div className="relative">
            <h2 className="display-title text-3xl md:text-4xl mb-4">
              Ready to sell on TechVault?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Join 1,200+ verified vendors. Zero listing fees, transparent commissions, and a global customer base.
            </p>
            <Link to="/auth" className="btn-primary text-base px-8 py-3.5">
              <i className="fas fa-store" /> Apply as a Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}