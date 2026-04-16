/**
 * App.jsx — Router configuration
 *
 * LESSON: React Router v6
 * In HTML you have separate files: home.html, products.html, etc.
 * In React, there's ONE html file. React Router intercepts URL changes
 * and swaps which component renders — without reloading the page.
 *
 * Key concepts:
 * BrowserRouter  — uses the browser's History API (normal URLs like /products)
 * Routes         — container that picks the FIRST matching <Route>
 * Route          — maps a URL path to a component
 * Outlet         — a "slot" where child routes render inside a layout
 *
 * Our structure:
 *   /                → HomePage
 *   /products        → ProductsPage
 *   /products/:id    → ProductDetailPage  (:id is a dynamic param like /products/42)
 *   /vendors         → VendorsPage
 *   /vendors/:id     → VendorDetailPage
 *   /auth            → AuthPage
 *   *                → NotFoundPage (catch-all for unknown URLs)
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout.jsx'

// Pages — we'll build each one
import HomePage          from './pages/HomePage.jsx'
import ProductsPage      from './pages/ProductsPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import VendorsPage       from './pages/VendorsPage.jsx'
import VendorDetailPage  from './pages/VendorDetailPage.jsx'
import AuthPage          from './pages/AuthPage.jsx'
import NotFoundPage      from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*
          MainLayout wraps every page — it contains the Navbar and Footer.
          The <Outlet> inside MainLayout is where child routes render.
          This means we write Navbar ONCE and it appears on ALL pages.
        */}
        <Route path="/" element={<MainLayout />}>
          <Route index          element={<HomePage />} />
          <Route path="products"     element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="vendors"      element={<VendorsPage />} />
          <Route path="vendors/:id"  element={<VendorDetailPage />} />
          <Route path="auth"         element={<AuthPage />} />
          <Route path="*"            element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}