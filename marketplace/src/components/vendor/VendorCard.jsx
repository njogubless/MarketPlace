import { Link } from 'react-router-dom'
import StarRating from '../ui/StarRating.jsx'

export default function VendorCard({ vendor }) {
  const { id, handle, initials, gradient, rating, reviews, sales, satisfaction, shipsFrom, shipsFromFlag, memberSince, verified, express, bio, specialties } = vendor

  return (
    <div className="vendor-card flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-lg font-bold text-white font-display flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display font-semibold text-white">{handle}</h2>
            {verified && <span className="badge-green text-[10px]"><i className="fas fa-check" /> Verified</span>}
            {express && <span className="badge-gold text-[10px]"><i className="fas fa-bolt" /> Express</span>}
          </div>
          <StarRating rating={rating} count={reviews} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Total Sales',   value: sales.toLocaleString() },
          { label: 'Satisfaction',  value: `${satisfaction}%` },
          { label: 'Member Since',  value: memberSince },
          { label: 'Ships From',    value: shipsFrom },
        ].map(({ label, value }) => (
          <div key={label} className="bg-void-700/60 rounded-lg p-2.5 border border-void-600">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm text-white font-medium mt-0.5 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Bio */}
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{bio}</p>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5">
        {specialties.map(s => (
          <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-void-700 text-gray-400 border border-void-600">{s}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Link to={`/vendors/${id}`} className="btn-cyan flex-1 justify-center text-xs py-2">
          <i className="fas fa-store" /> View Store
        </Link>
        <button className="btn-secondary px-3 py-2 text-xs">
          <i className="fas fa-heart" />
        </button>
      </div>
    </div>
  )
}