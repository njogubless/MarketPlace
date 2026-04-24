/**
 * src/components/layout/Navbar.jsx
 *
 * LESSON: Key React concepts used here
 *
 * 1. useCartContext()
 *    Reads the cart from Context. No props needed.
 *    The badge automatically updates when items are added anywhere in the app.
 *
 * 2. NavLink vs Link
 *    Link    → just navigates, no awareness of active page
 *    NavLink → same as Link BUT passes { isActive } to className
 *              so you can style the current page differently
 *
 * 3. useState(false) for mobile menu
 *    The open/closed state of the mobile menu only matters to this component.
 *    It does NOT belong in Context or TanStack Query — just local useState.
 *
 * 4. Conditional rendering  {mobileOpen && <div>...</div>}
 *    When mobileOpen is false, the menu is completely removed from the DOM.
 *    This is different from display:none — the element doesn't exist at all.
 */

import { useState }       from 'react'
import { Link, NavLink }  from 'react-router-dom'
import { useCartContext }  from '../../context/CartContext'

export default function Navbar() {
  const { totalItems }              = useCartContext()
  const [mobileOpen, setMobileOpen] = useState(false)

  // NavLink className prop accepts a function — React Router calls it
  // with { isActive: true/false } depending on the current URL
  const linkClass = ({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'

  return (
    <nav className="sticky top-0 z-50 bg-void-800/80 backdrop-blur-md border-b border-void-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ───────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neon-purple to-cyan-500 flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform">
              <i className="fas fa-bolt text-xs text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              Tech
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-cyan-400">
                Vault
              </span>
            </span>
          </Link>

          {/* ── Desktop links ───────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/"        end className={linkClass}>Home</NavLink>
            <NavLink to="/products"    className={linkClass}>Products</NavLink>
            <NavLink to="/vendors"     className={linkClass}>Vendors</NavLink>
          </div>

          {/* ── Right side ──────────────────────────────────── */}
          <div className="flex items-center gap-3">

            {/* Cart button — badge shows count, only when cart has items */}
            <Link to="/cart" className="relative btn-secondary px-3 py-2">
              <i className="fas fa-bag-shopping" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-neon-purple text-[10px] text-white flex items-center justify-center font-bold leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Sign in — hidden on very small screens */}
            <NavLink to="/auth" className="btn-primary hidden sm:inline-flex">
              <i className="fas fa-user text-xs" /> Sign In
            </NavLink>

            {/* Hamburger — only shows on mobile */}
            <button
              className="md:hidden btn-secondary px-3 py-2"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              <i className={mobileOpen ? 'fas fa-xmark' : 'fas fa-bars'} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-void-600 bg-void-800 px-4 py-3 flex flex-col gap-1">
          <NavLink to="/"        end className={linkClass} onClick={() => setMobileOpen(false)}>
            <i className="fas fa-house mr-2" />Home
          </NavLink>
          <NavLink to="/products"    className={linkClass} onClick={() => setMobileOpen(false)}>
            <i className="fas fa-boxes-stacked mr-2" />Products
          </NavLink>
          <NavLink to="/vendors"     className={linkClass} onClick={() => setMobileOpen(false)}>
            <i className="fas fa-store mr-2" />Vendors
          </NavLink>
          <NavLink to="/cart"        className={linkClass} onClick={() => setMobileOpen(false)}>
            <i className="fas fa-bag-shopping mr-2" />
            Cart {totalItems > 0 && `(${totalItems})`}
          </NavLink>
          <NavLink to="/auth"        className={linkClass} onClick={() => setMobileOpen(false)}>
            <i className="fas fa-user mr-2" />Sign In
          </NavLink>
        </div>
      )}
    </nav>
  )
}