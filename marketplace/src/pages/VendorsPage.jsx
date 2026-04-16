import { useState } from 'react'
import { useVendors } from '../hooks/useVendors.js'
import VendorCard from '../components/vendor/VendorCard.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

const SORT_OPTIONS = [
  { value: 'rating',  label: 'Highest Rated' },
  { value: 'sales',   label: 'Most Sales' },
  { value: 'reviews', label: 'Most Reviews' },
]

export default function VendorsPage() {
  const [search, setSearch] = useState('')
  const [sort,   setSort]   = useState('rating')
  const { data: vendors, isLoading, isError, refetch } = useVendors({ search, sort })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="display-title text-3xl">Verified Vendors</h1>
        <p className="text-gray-500 text-sm mt-1">Trusted sellers with proven track records</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="fas fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search by name, location, specialty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2.5 text-sm"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input py-2.5 text-sm w-full sm:w-48 bg-void-700"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading vendors..." />
      ) : isError ? (
        <ErrorMessage onRetry={refetch} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors?.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)}
        </div>
      )}
    </div>
  )
}