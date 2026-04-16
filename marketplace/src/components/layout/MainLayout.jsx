/**
 * MainLayout.jsx
 *
 * LESSON: Layout components + Outlet
 *
 * MainLayout is a "wrapper" component that renders:
 *   <Navbar />
 *   <Outlet />    ← this is where the current page renders
 *   <Footer />
 *
 * <Outlet> is from React Router. It's a placeholder that React Router
 * fills with whichever child route matches the current URL.
 * That's why Navbar/Footer appear on every page with zero duplication.
 */

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Outlet = the current page component renders here */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}