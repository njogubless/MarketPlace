// api/vendors.js

function normalizeVendor(v) {
  return {
    id:           v.id,
    handle:       `@${v.handle}`,
    initials:     v.shop_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '??',
    gradient:     pickGradient(v.id),          // deterministic colour from id
    rating:       v.stats?.avg_rating    ?? 0,
    reviews:      v.stats?.total_reviews ?? 0,
    sales:        v.stats?.total_sales   ?? 0,
    satisfaction: calcSatisfaction(v.stats),   // derived — see below
    shipsFrom:    v.location || 'Unknown',
    memberSince:  v.created_at?.slice(0, 4) ?? '—',
    verified:     v.is_verified  ?? false,
    express:      false,                       // no express field in your model yet
    bio:          v.description  ?? '',        // description → bio
    specialties:  v.specialties  ?? [],        // add this field to model when ready
  }
}

// Pick a consistent gradient per vendor so it doesn't flicker on re-render
const GRADIENTS = [
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
]
function pickGradient(id) {
  return GRADIENTS[id % GRADIENTS.length]
}

// VendorStats has no satisfaction field — derive it from avg_rating
function calcSatisfaction(stats) {
  if (!stats?.avg_rating) return 0
  return Math.round((stats.avg_rating / 5) * 100)
}

export async function fetchVendors({ search, sort } = {}) {
  const params = {}
  if (search)                 params.search   = search
  if (sort && SORT_MAP[sort]) params.ordering = SORT_MAP[sort]

  const { data } = await apiClient.get('vendors/', { params })
  const results = data.results ?? data
  return results.map(normalizeVendor)           // ← transform here
}

export async function fetchVendorById(id) {
  const { data } = await apiClient.get(`vendors/${id}/`)
  return normalizeVendor(data)                  // ← and here
}