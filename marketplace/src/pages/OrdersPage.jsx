

import { Link }         from 'react-router-dom'
import { useOrders }    from '../hooks/useServerCart'
import LoadingSpinner   from '../components/ui/LoadingSpinner'
import ErrorMessage     from '../components/ui/ErrorMessage'

// Map Django status values to badge styles + icons
const STATUS_STYLES = {
  pending:   { cls: 'badge-gold',   icon: 'fa-clock',          label: 'Pending' },
  confirmed: { cls: 'badge-cyan',   icon: 'fa-check',          label: 'Confirmed' },
  shipped:   { cls: 'badge-purple', icon: 'fa-truck',          label: 'Shipped' },
  delivered: { cls: 'badge-green',  icon: 'fa-box-open',       label: 'Delivered' },
  cancelled: { cls: 'badge-red',    icon: 'fa-xmark',          label: 'Cancelled' },
}

export default function OrdersPage() {
  const { data: orders, isLoading, isError, refetch } = useOrders()

  if (isLoading) return <LoadingSpinner message="Loading your orders..." />
  if (isError)   return <ErrorMessage message="Could not load orders." onRetry={refetch} />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="display-title text-3xl">My Orders</h1>
        <p className="text-gray-500 text-sm mt-1">
          {orders?.length ?? 0} {orders?.length === 1 ? 'order' : 'orders'} placed
        </p>
      </div>

      {/* Empty state */}
      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-20 h-20 rounded-2xl bg-void-800 border border-void-600 flex items-center justify-center">
            <i className="fas fa-box-open text-3xl text-gray-600" />
          </div>
          <div className="text-center">
            <h2 className="font-display font-semibold text-white text-xl mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 text-sm">
              When you place an order it will appear here.
            </p>
          </div>
          <Link to="/products" className="btn-primary">
            <i className="fas fa-boxes-stacked" /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── OrderCard ─────────────────────────────────────────────────────────────────

function OrderCard({ order }) {
  const statusInfo = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending

  // Format date nicely
  const date = new Date(order.created_at).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })

  return (
    <div className="card-glow p-5">
      {/* Order header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className={`badge ${statusInfo.cls}`}>
            <i className={`fas ${statusInfo.icon} text-[10px]`} />
            {statusInfo.label}
          </span>
          <span className="text-xs text-gray-500">Order #{order.id}</span>
          <span className="text-xs text-gray-600">{date}</span>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-white text-lg">
            ${Number(order.total_price).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {order.item_count} {order.item_count === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      {/* Order items */}
      <div className="divide-y divide-void-700">
        {order.items.map(item => (
          <div key={item.id} className="py-3 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {item.product_name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                <i className="fas fa-store mr-1 text-neon-purple/60" />
                {item.vendor_name}
                <span className="mx-2">·</span>
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-white font-medium">
                ${Number(item.subtotal).toFixed(2)}
              </p>
              <p className="text-[10px] text-gray-600">
                ${Number(item.price_at_purchase).toFixed(2)} each
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="mt-4 pt-4 border-t border-void-700 flex items-center justify-between">
        {order.address && (
          <p className="text-xs text-gray-500 truncate max-w-xs">
            <i className="fas fa-location-dot mr-1" />
            {order.address}
          </p>
        )}
        <div className="flex gap-2 ml-auto">
          {order.status === 'delivered' && (
            <Link
              to={`/products`}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <i className="fas fa-rotate-left" /> Buy Again
            </Link>
          )}
          <Link
            to={`/orders/${order.id}`}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            <i className="fas fa-eye" /> View Details
          </Link>
        </div>
      </div>
    </div>
  )
}