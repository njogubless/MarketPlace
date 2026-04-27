
import { useState }       from 'react'
import { Link }           from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import StarRating         from '../ui/StarRating'

const BADGE_STYLES = {
  'Best Seller': { cls: 'badge-gold',   icon: 'fa-trophy' },
  'New':         { cls: 'badge-green',  icon: 'fa-sparkles' },
  'Staff Pick':  { cls: 'badge-purple', icon: 'fa-star' },
  'Digital':     { cls: 'badge-cyan',   icon: 'fa-bolt' },
  'Premium':     { cls: 'badge-gold',   icon: 'fa-gem' },
  'Limited':     { cls: 'badge-red',    icon: 'fa-fire' },
}

export default function ProductCard({ product }) {
  const { addItem, isAdding } = useCartContext()
  const [added, setAdded]     = useState(false)

  // Works for both mock data (id field) and Django API (id field)
  const price    = Number(product.price)
  const priceOld = product.price_old ? Number(product.price_old) : null
  const inStock  = product.in_stock ?? product.stock > 0
  const badge    = product.badge ?? (product.is_featured ? 'Featured' : null)
  const discount = priceOld ? Math.round((1 - price / priceOld) * 100) : null
  const badgeInfo = badge ? (BADGE_STYLES[badge] ?? { cls: 'badge-purple', icon: 'fa-tag' }) : null

  // Vendor name — handles both API shape and mock data shape
  const vendorName =
    product.vendor?.shop_name ??
    product.vendor?.handle ??
    product.vendorHandle ??
    'Unknown'

  // Category name — handles nested object or plain string
  const categoryName =
    typeof product.category === 'object'
      ? product.category?.name
      : product.category ?? ''

  async function handleAddToCart() {
    if (!inStock || isAdding || added) return
    try {
      await addItem(product)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      console.error('Add to cart failed:', err)
    }
  }

  return (
    <div className="product-card group flex flex-col">

      {/* Image area */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative bg-gradient-to-br from-void-700 to-void-800 h-48 flex items-center justify-center overflow-hidden rounded-t-2xl">

          {/* Hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/0 to-cyan-500/0 group-hover:from-neon-purple/5 group-hover:to-cyan-500/5 transition-all duration-500" />

          {/* Image or icon fallback */}
          {product.image
            ? <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            : <i className={`fas ${product.icon ?? 'fa-box'} text-6xl ${product.iconColor ?? 'text-gray-600'} opacity-25 group-hover:opacity-40 transition-opacity duration-500`} />
          }

          {/* Badge */}
          {badgeInfo && (
            <span className={`absolute top-3 left-3 badge ${badgeInfo.cls}`}>
              <i className={`fas ${badgeInfo.icon} text-[10px]`} /> {badge}
            </span>
          )}

          {/* Discount */}
          {discount && (
            <span className="absolute top-3 right-3 badge-green">-{discount}%</span>
          )}

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-void-900/70 flex items-center justify-center">
              <span className="badge-red px-3 py-1.5">
                <i className="fas fa-clock mr-1" /> Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Vendor + name */}
        <div>
          <p className="text-xs text-gray-500 mb-1 font-mono">
            <i className="fas fa-store mr-1 text-neon-purple/70" />
            {vendorName}
          </p>
          <Link to={`/products/${product.id}`}>
            <h3 className="font-display font-semibold text-white text-sm leading-snug line-clamp-2 hover:text-cyan-300 transition-colors">
              {product.name}
            </h3>
          </Link>
          {categoryName && (
            <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wide">
              {categoryName}
            </p>
          )}
        </div>

        {/* Rating */}
        <StarRating
          rating={product.average_rating ?? product.rating ?? 0}
          count={product.review_count ?? product.reviewCount ?? 0}
        />

        {/* Price + Add to cart */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-white font-bold font-display text-lg">
              ${price.toFixed(2)}
            </p>
            {priceOld && (
              <p className="text-xs text-gray-600 line-through">
                ${priceOld.toFixed(2)}
              </p>
            )}
          </div>

          {/* Add to Cart button — 3 states: normal / loading / success */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              !inStock
                ? 'bg-void-700 text-gray-600 cursor-not-allowed'
                : added
                  ? 'bg-emerald-600 text-white scale-110'
                  : 'bg-gradient-to-br from-neon-purple to-violet-700 hover:shadow-glow-purple hover:scale-105 text-white'
            }`}
            title={!inStock ? 'Out of stock' : 'Add to cart'}
          >
            {isAdding
              ? <i className="fas fa-spinner animate-spin text-sm" />
              : added
                ? <i className="fas fa-check text-sm" />
                : <i className="fas fa-bag-shopping text-sm" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}