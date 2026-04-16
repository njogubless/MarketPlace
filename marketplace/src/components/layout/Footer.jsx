import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-void-600 mt-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-neon-purple to-cyan-500 flex items-center justify-center">
                <i className="fas fa-bolt text-xs text-white" />
              </div>
              <span className="font-display font-bold text-white">
                Tech<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-cyan-400">Vault</span>
              </span>
            </Link>
            <p className="mt-3 text-xs text-gray-600 max-w-xs">
              The future marketplace for tech products, software, and digital goods. Trusted by thousands of buyers worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-medium text-white mb-3">Marketplace</h4>
              <div className="flex flex-col gap-2 text-gray-500">
                <Link to="/products" className="hover:text-white transition">All Products</Link>
                <Link to="/vendors"  className="hover:text-white transition">Vendors</Link>
                <Link to="/auth"     className="hover:text-white transition">Sign In</Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3">Categories</h4>
              <div className="flex flex-col gap-2 text-gray-500">
                <Link to="/products?cat=laptops"  className="hover:text-white transition">Laptops & PCs</Link>
                <Link to="/products?cat=gaming"   className="hover:text-white transition">Gaming</Link>
                <Link to="/products?cat=software" className="hover:text-white transition">Software</Link>
                <Link to="/products?cat=audio"    className="hover:text-white transition">Audio</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-void-700 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-700">© 2025 TechVault. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="badge-green text-[10px] px-2 py-0.5">
              <i className="fas fa-shield-check" /> Secure Checkout
            </span>
            <span className="badge-cyan text-[10px] px-2 py-0.5">
              <i className="fas fa-rotate" /> 30-Day Returns
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}