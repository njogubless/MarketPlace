/**
 * src/main.jsx
 *
 * LESSON: The app entry point.
 * Three providers wrap the whole app:
 *   QueryClientProvider → gives every component access to TanStack Query
 *   CartProvider        → gives every component access to the cart
 *   ReactQueryDevtools  → floating panel in dev to inspect the cache
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CartProvider } from './context/CartContext'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            1000 * 60 * 5,  // data stays fresh for 5 minutes
      retry:                2,              // retry failed requests twice
      refetchOnWindowFocus: false,          // don't refetch when switching tabs
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <App />
      </CartProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)