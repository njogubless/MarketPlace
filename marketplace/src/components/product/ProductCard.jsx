/**
 * ProductCard.jsx
 *
 * LESSON: Component composition + callback props
 *
 * This component receives a `product` object and an `onAddToCart` function as props.
 * Props flow DOWN from parent to child (parent gives data to child).
 * Events flow UP from child to parent (child calls parent's function).
 *
 * Link from React Router makes the card clickable and navigates to /products/:id
 * without a full page reload.
 */

import { Link } from 'react-router-dom'
import StarRating from '../ui/StarRating.jsx'

const BADGE_VARIANTS = {
  'Best Seller': { cls: 'badge-gold',   icon: 'fa-trophy' },
  'New':         { cls: 'badge-green',  icon: 'fa-sparkles' },
  'Staff Pick':  { cls: 'badge-purple', icon: 'fa-star' },
  'Digital':     { cls: 'badge-cyan',   icon: 'fa-bolt' },
  'Premium':     { cls: 'badge-gold',   icon: 'fa-gem' },
  'Limited':     { cls: 'badge-red',    icon: 'fa-fire' },
}

export default function ProductCard({ product, onAddToCart }) {
  const { id, name, vendorHandle, price, priceOld, icon, iconColor, rating, reviewCount, inStock, badge } = product
  const badgeInfo = badge ? BADGE_VARIANTS[badge] : null
  const discount = priceOld ? Math.round((1 - price / priceOld) * 100) : null

  return (
    <div className="product-card group flex flex-col">
      {/* Image area */}
      <Link to={`/products/${id}`} className="block">
        <div className="relative bg-gradient-to-br from-void-700 to-void-800 h-48 flex items-center justify-center overflow-hidden rounded-t-2xl">
          {/* Animated background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/0 to-cyan-500/0 group-hover:from-neon-purple/5 group-hover:to-cyan-500/5 transition-all duration-500" />
          <i className={`fas ${icon} text-6xl ${iconColor} opacity-25 group-hover:opacity-40 transition-opacity duration-500`} />

          {/* Badge */}
          {badgeInfo && (
            <span className={`absolute top-3 left-3 badge ${badgeInfo.cls}`}>
              <i className={`fas ${badgeInfo.icon} text-[10px]`} /> {badge}
            </span>
          )}

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-void-900/60 flex items-center justify-center rounded-t-2xl">
              <span className="badge-red text-xs px-3 py-1.5">
                <i className="fas fa-clock mr-1" /> Out of Stock
              </span>
            </div>
          )}

          {/* Discount */}
          {discount && (
            <span className="absolute top-3 right-3 badge-green text-[10px]">-{discount}%</span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1 font-mono">
            <i className="fas fa-store mr-1 text-neon-purple/70" />{vendorHandle}
          </p>
          <Link to={`/products/${id}`}>
            <h3 className="font-display font-semibold text-white text-sm leading-snug line-clamp-2 hover:text-cyan-300 transition-colors">
              {name}
            </h3>
          </Link>
        </div>

        <StarRating rating={rating} count={reviewCount} />

        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-white font-bold font-display text-lg">${price.toLocaleString()}</p>
            {priceOld && <p className="text-xs text-gray-600 line-through">${priceOld.toLocaleString()}</p>}
          </div>

          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!inStock}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              inStock
                ? 'bg-gradient-to-br from-neon-purple to-violet-700 hover:shadow-glow-purple hover:scale-105 text-white'
                : 'bg-void-700 text-gray-600 cursor-not-allowed'
            }`}
            title={inStock ? 'Add to cart' : 'Out of stock'}
          >
            <i className="fas fa-bag-shopping text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}