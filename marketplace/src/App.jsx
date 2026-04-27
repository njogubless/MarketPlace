

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout        from './components/layout/MainLayout'
import HomePage          from './pages/HomePage'
import ProductsPage      from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import VendorsPage       from './pages/VendorsPage'
import VendorDetailPage  from './pages/VendorDetailPage'
import CartPage          from './pages/CartPage'
import OrdersPage        from './pages/OrdersPage'
import AuthPage          from './pages/AuthPage'
import NotFoundPage      from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index                element={<HomePage />} />
          <Route path="products"      element={<ProductsPage />} />
          <Route path="products/:id"  element={<ProductDetailPage />} />
          <Route path="vendors"       element={<VendorsPage />} />
          <Route path="vendors/:id"   element={<VendorDetailPage />} />
          <Route path="cart"          element={<CartPage />} />
          <Route path="orders"        element={<OrdersPage />} />
          <Route path="auth"          element={<AuthPage />} />
          <Route path="*"             element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}