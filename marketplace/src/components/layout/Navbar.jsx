/**
 * AuthPage.jsx — Login + Register (converted from your HTML auth page)
 *
 * LESSON: Controlled forms in React
 *
 * In HTML, forms manage their own state (the browser tracks input values).
 * In React, WE manage the state. Every input is "controlled":
 *   value={formData.email}         ← React controls what's displayed
 *   onChange={e => setFormData(…)} ← every keystroke updates state
 *
 * This gives us full control: validate on every keystroke, show password
 * strength meters, disable submit until valid, etc.
 *
 * useState with an object holds multiple fields together cleanly.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Initial empty state for each form
const EMPTY_LOGIN    = { username: '', password: '', remember: false }
const EMPTY_REGISTER = { username: '', email: '', password: '', confirm: '', agreeTerms: false }

export default function AuthPage() {
  const [tab, setTab] = useState('login')  // 'login' | 'register'
  const navigate = useNavigate()

  // ── Login state ──
  const [loginData, setLoginData]     = useState(EMPTY_LOGIN)
  const [loginError, setLoginError]   = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // ── Register state ──
  const [regData, setRegData]       = useState(EMPTY_REGISTER)
  const [regError, setRegError]     = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)

  // Generic change handler for any form
  // [e.target.name]: e.target.value uses computed property names — updates only the changed field
  function handleLoginChange(e) {
    const { name, value, type, checked } = e.target
    setLoginData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleRegChange(e) {
    const { name, value, type, checked } = e.target
    setRegData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleLogin(e) {
    e.preventDefault()  // prevent browser default form submission (page reload)
    setLoginError('')
    if (!loginData.username || !loginData.password) {
      setLoginError('Please fill in all fields.')
      return
    }
    setLoginLoading(true)
    // Simulate API call — replace with real auth later
    await new Promise(r => setTimeout(r, 1200))
    setLoginLoading(false)
    navigate('/')  // useNavigate() programmatically goes to a route
  }

  async function handleRegister(e) {
    e.preventDefault()
    setRegError('')
    if (!regData.username || !regData.email || !regData.password) {
      setRegError('All fields are required.')
      return
    }
    if (regData.password !== regData.confirm) {
      setRegError('Passwords do not match.')
      return
    }
    if (!regData.agreeTerms) {
      setRegError('You must agree to the terms.')
      return
    }
    setRegLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setRegLoading(false)
    setRegSuccess(true)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-neon-purple/8 blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-cyan-500/6 blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-neon-purple to-cyan-500 flex items-center justify-center shadow-glow-purple">
              <i className="fas fa-bolt text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">
              Tech<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-cyan-400">Vault</span>
            </span>
          </Link>
          <h1 className="display-title text-2xl mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account or create a new one</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-void-800 rounded-xl p-1 mb-6 border border-void-600">
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setLoginError(''); setRegError('') }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
                tab === t
                  ? 'bg-gradient-to-r from-neon-purple to-violet-700 text-white shadow-glow-purple'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'login' ? (
                <><i className="fas fa-user-lock mr-2" />Login</>
              ) : (
                <><i className="fas fa-user-plus mr-2" />Register</>
              )}
            </button>
          ))}
        </div>

        {/* ── LOGIN FORM ── */}
        {tab === 'login' && (
          <div className="card-glow p-7">
            <div className="text-center mb-6">
              <span className="badge-cyan text-xs">
                <i className="fas fa-shield-check" /> Secured Connection
              </span>
              <h2 className="display-title text-xl mt-3">Sign In</h2>
              <p className="text-gray-500 text-xs mt-1">Enter your credentials to continue</p>
            </div>

            {loginError && (
              <div className="badge-red px-4 py-3 rounded-xl text-xs mb-4 w-full">
                <i className="fas fa-triangle-exclamation mr-2" />{loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Username</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    name="username"
                    type="text"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    placeholder="your_username"
                    className="input pl-9"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="label mb-0">Password</label>
                  <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition">Forgot password?</a>
                </div>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    className="input pl-9"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  name="remember"
                  type="checkbox"
                  checked={loginData.remember}
                  onChange={handleLoginChange}
                  className="h-4 w-4 rounded bg-void-700 border-void-600 accent-violet-600"
                />
                <label className="text-xs text-gray-400">Remember this device</label>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn-primary w-full justify-center py-3 text-sm"
              >
                {loginLoading
                  ? <><i className="fas fa-spinner animate-spin" /> Signing in...</>
                  : <><i className="fas fa-arrow-right-to-bracket" /> Sign In</>
                }
              </button>
            </form>

            <div className="relative flex items-center my-5">
              <div className="flex-1 border-t border-void-600" />
              <span className="px-3 text-xs text-gray-600 bg-void-800">or continue with</span>
              <div className="flex-1 border-t border-void-600" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary text-xs justify-center py-2.5">
                <i className="fab fa-google text-red-400" /> Google
              </button>
              <button className="btn-secondary text-xs justify-center py-2.5">
                <i className="fab fa-github" /> GitHub
              </button>
            </div>
          </div>
        )}

        {/* ── REGISTER FORM ── */}
        {tab === 'register' && (
          <div className="card-glow p-7">
            {regSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-emerald-400 text-2xl" />
                </div>
                <h3 className="display-title text-xl mb-2">Account Created!</h3>
                <p className="text-gray-400 text-sm mb-6">Welcome to TechVault. You can now sign in.</p>
                <button onClick={() => { setTab('login'); setRegSuccess(false) }} className="btn-primary">
                  <i className="fas fa-arrow-right-to-bracket" /> Go to Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <span className="badge-purple text-xs">
                    <i className="fas fa-user-shield" /> Free Account
                  </span>
                  <h2 className="display-title text-xl mt-3">Create Account</h2>
                  <p className="text-gray-500 text-xs mt-1">Join thousands of tech buyers</p>
                </div>

                {regError && (
                  <div className="badge-red px-4 py-3 rounded-xl text-xs mb-4 w-full">
                    <i className="fas fa-triangle-exclamation mr-2" />{regError}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="label">Username</label>
                    <div className="relative">
                      <i className="fas fa-user-circle absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                      <input name="username" type="text" value={regData.username} onChange={handleRegChange}
                        placeholder="choose_a_username" className="input pl-9" autoComplete="username" />
                    </div>
                  </div>

                  <div>
                    <label className="label">Email Address</label>
                    <div className="relative">
                      <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                      <input name="email" type="email" value={regData.email} onChange={handleRegChange}
                        placeholder="you@email.com" className="input pl-9" autoComplete="email" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Password</label>
                      <div className="relative">
                        <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                        <input name="password" type="password" value={regData.password} onChange={handleRegChange}
                          placeholder="••••••••" className="input pl-9" autoComplete="new-password" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Confirm</label>
                      <div className="relative">
                        <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                        <input name="confirm" type="password" value={regData.confirm} onChange={handleRegChange}
                          placeholder="••••••••" className="input pl-9" autoComplete="new-password" />
                      </div>
                    </div>
                  </div>

                  {/* Password match indicator */}
                  {regData.confirm && (
                    <p className={`text-xs flex items-center gap-1 ${regData.password === regData.confirm ? 'text-emerald-400' : 'text-red-400'}`}>
                      <i className={`fas ${regData.password === regData.confirm ? 'fa-check-circle' : 'fa-times-circle'}`} />
                      {regData.password === regData.confirm ? 'Passwords match' : 'Passwords do not match'}
                    </p>
                  )}

                  <div className="flex items-start gap-2">
                    <input name="agreeTerms" type="checkbox" checked={regData.agreeTerms} onChange={handleRegChange}
                      className="h-4 w-4 mt-0.5 rounded bg-void-700 border-void-600 accent-violet-600" />
                    <label className="text-xs text-gray-400 leading-relaxed">
                      I agree to the{' '}
                      <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>
                    </label>
                  </div>

                  <button type="submit" disabled={regLoading} className="btn-primary w-full justify-center py-3 text-sm">
                    {regLoading
                      ? <><i className="fas fa-spinner animate-spin" /> Creating account...</>
                      : <><i className="fas fa-user-plus" /> Create Account</>
                    }
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}