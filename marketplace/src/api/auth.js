/**
 * src/api/auth.js
 *
 * LESSON: This is the corrected JavaScript version of auth.ts
 * Everything removed compared to the TypeScript version:
 *   - No `interface` blocks
 *   - No `: TypeName` on parameters
 *   - No `Promise<Type>` return annotations
 *   - No `<TypeName>` on axios calls like apiClient.post<AuthTokens>()
 * The logic is 100% identical — TypeScript just adds labels on top.
 */

import apiClient from './client'
import { TokenStorage } from './client'

export async function login(payload) {
  // POST /api/auth/login/ → Django returns { access, refresh }
  const { data } = await apiClient.post('auth/login/', payload)
  TokenStorage.setTokens(data.access, data.refresh)

  // Fetch the logged-in user's profile straight after
  const { data: user } = await apiClient.get('auth/me/')
  return user
}

export async function register(payload) {
  // POST /api/auth/register/ → create account
  await apiClient.post('auth/register/', payload)
  // Auto-login immediately after registering
  return login({ email: payload.email, password: payload.password })
}

export async function logout() {
  TokenStorage.clearTokens()
}

export async function getMe() {
  const { data } = await apiClient.get('users/me/')
  return data
}