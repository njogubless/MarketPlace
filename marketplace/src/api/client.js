/**
 * src/api/client.js
 *
 * LESSON: This is the single HTTP layer for the whole app.
 * Every API call goes through this — it automatically:
 *   1. Adds http://localhost:8000/api/ to every URL
 *   2. Attaches the JWT token to every request header
 *   3. If the token expires → silently fetches a new one and retries
 *   4. If refresh fails → sends user to /auth login page
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// ── Token helpers — read/write JWT from localStorage ──────────────────────
export const TokenStorage = {
  getAccess:   () => localStorage.getItem('access_token'),
  getRefresh:  () => localStorage.getItem('refresh_token'),
  setTokens:   (access, refresh) => {
    localStorage.setItem('access_token',  access)
    localStorage.setItem('refresh_token', refresh)
  },
  clearTokens: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}

// ── Create one shared Axios instance ─────────────────────────────────────
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ── REQUEST interceptor — attach token to every outgoing request ──────────
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getAccess()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── RESPONSE interceptor — auto-refresh when token expires ────────────────
let isRefreshing = false
let failedQueue  = []

function processQueue(error, token = null) {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token))
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return apiClient(original)
        })
      }

      original._retry = true
      isRefreshing    = true
      const refreshToken = TokenStorage.getRefresh()

      if (!refreshToken) {
        TokenStorage.clearTokens()
        window.location.href = '/auth'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
          refresh: refreshToken,
        })
        TokenStorage.setTokens(data.access, data.refresh ?? refreshToken)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
        processQueue(null, data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return apiClient(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        TokenStorage.clearTokens()
        window.location.href = '/auth'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient