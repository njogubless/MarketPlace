/**
 * src/pages/AuthPage.jsx — corrected version
 *
 * WHAT WAS WRONG IN THE OLD VERSION:
 * ─────────────────────────────────────────────────────────
 * 1. Login used `username`     → Django uses EMAIL to login
 * 2. Register had `username`   → Django expects `full_name`
 * 3. Register had `confirm`    → Django expects `confirm_password`
 * 4. Both handlers used fake setTimeout → now calls real API
 * 5. Two separate change handlers → now one shared handleChange()
 * 6. No real error handling → now shows Django's actual error messages
 * ─────────────────────────────────────────────────────────
 */

import { useState }          from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, register }   from '../api/auth'

// ── Initial form states ───────────────────────────────────────────────────
const EMPTY_LOGIN = {
  email:    '',
  password: '',
  remember: false,
}

const EMPTY_REGISTER = {
  full_name:        '',   // was: username
  email:            '',
  password:         '',
  confirm_password: '',   // was: confirm
  agreeTerms:       false,
}

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const navigate      = useNavigate()

  // Login state
  const [loginData,    setLoginData]    = useState(EMPTY_LOGIN)
  const [loginError,   setLoginError]   = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Register state
  const [regData,    setRegData]    = useState(EMPTY_REGISTER)
  const [regError,   setRegError]   = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)

  // ── LESSON: One shared change handler factory ─────────────────────────
  // handleChange(setLoginData) → returns a function that updates login state
  // handleChange(setRegData)   → returns a function that updates register state
  // [e.target.name] uses the input's name= attribute as the key to update
  function handleChange(setter) {
    return function (e) {
      const { name, value, type, checked } = e.target
      setter(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
  }

  // ── Login submit ──────────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')

    if (!loginData.email || !loginData.password) {
      setLoginError('Please fill in all fields.')
      return
    }

    setLoginLoading(true)
    try {
      await login({ email: loginData.email, password: loginData.password })
      navigate('/')
    } catch (err) {
      // Django SimpleJWT returns: { detail: "No active account found..." }
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Login failed. Please check your credentials.'
      setLoginError(msg)
    } finally {
      setLoginLoading(false)
    }
  }

  // ── Register submit ───────────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault()
    setRegError('')

    if (!regData.full_name || !regData.email || !regData.password) {
      setRegError('All fields are required.')
      return
    }
    if (regData.password !== regData.confirm_password) {
      setRegError('Passwords do not match.')
      return
    }
    if (!regData.agreeTerms) {
      setRegError('You must agree to the terms to continue.')
      return
    }

    setRegLoading(true)
    try {
      await register({
        full_name:        regData.full_name,
        email:            regData.email,
        password:         regData.password,
        confirm_password: regData.confirm_password,
      })
      setRegSuccess(true)
    } catch (err) {
      // Django field errors: { email: ["Already exists."], password: ["Too short."] }
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const messages = Object.entries(data)
          .map(([field, errors]) => {
            const label = field === 'non_field_errors' ? '' : `${field}: `
            return `${label}${Array.isArray(errors) ? errors[0] : errors}`
          })
          .join('  |  ')
        setRegError(messages)
      } else {
        setRegError('Registration failed. Please try again.')
      }
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">

      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-neon-purple/8 blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-cyan-500/6 blur-3xl animate-pulse-slow pointer-events-none"
        style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative">

        {/* Logo */}
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
              {t === 'login'
                ? <><i className="fas fa-user-lock mr-2" />Login</>
                : <><i className="fas fa-user-plus mr-2" />Register</>
              }
            </button>
          ))}
        </div>

        {/* ══════════════════ LOGIN FORM ══════════════════ */}
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
              <div className="bg-red-900/30 border border-red-800/50 text-red-300 px-4 py-3 rounded-xl text-xs mb-4 flex items-center gap-2">
                <i className="fas fa-triangle-exclamation flex-shrink-0" />
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">

              {/* EMAIL — fixed from username */}
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleChange(setLoginData)}
                    placeholder="you@email.com"
                    className="input pl-9"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="label mb-0">Password</label>
                  <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleChange(setLoginData)}
                    placeholder="••••••••"
                    className="input pl-9"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center gap-2">
                <input
                  name="remember"
                  type="checkbox"
                  checked={loginData.remember}
                  onChange={handleChange(setLoginData)}
                  className="h-4 w-4 rounded bg-void-700 border-void-600 accent-violet-600"
                />
                <label className="text-xs text-gray-400">Remember this device</label>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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

        {/* ══════════════════ REGISTER FORM ══════════════════ */}
        {tab === 'register' && (
          <div className="card-glow p-7">

            {regSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-emerald-400 text-2xl" />
                </div>
                <h3 className="display-title text-xl mb-2">Account Created!</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Welcome to TechVault. You are now signed in.
                </p>
                <button onClick={() => navigate('/')} className="btn-primary">
                  <i className="fas fa-house" /> Go to Home
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
                  <div className="bg-red-900/30 border border-red-800/50 text-red-300 px-4 py-3 rounded-xl text-xs mb-4 flex items-start gap-2">
                    <i className="fas fa-triangle-exclamation flex-shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">

                  {/* FULL NAME — was: username */}
                  <div>
                    <label className="label">Full Name</label>
                    <div className="relative">
                      <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                      <input
                        name="full_name"
                        type="text"
                        value={regData.full_name}
                        onChange={handleChange(setRegData)}
                        placeholder="John Doe"
                        className="input pl-9"
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="label">Email Address</label>
                    <div className="relative">
                      <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                      <input
                        name="email"
                        type="email"
                        value={regData.email}
                        onChange={handleChange(setRegData)}
                        placeholder="you@email.com"
                        className="input pl-9"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD + CONFIRM */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Password</label>
                      <div className="relative">
                        <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                        <input
                          name="password"
                          type="password"
                          value={regData.password}
                          onChange={handleChange(setRegData)}
                          placeholder="••••••••"
                          className="input pl-9"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      {/* name="confirm_password" — was: confirm */}
                      <label className="label">Confirm</label>
                      <div className="relative">
                        <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                        <input
                          name="confirm_password"
                          type="password"
                          value={regData.confirm_password}
                          onChange={handleChange(setRegData)}
                          placeholder="••••••••"
                          className="input pl-9"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live password match indicator */}
                  {regData.confirm_password && (
                    <p className={`text-xs flex items-center gap-1 ${
                      regData.password === regData.confirm_password
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}>
                      <i className={`fas ${
                        regData.password === regData.confirm_password
                          ? 'fa-check-circle'
                          : 'fa-times-circle'
                      }`} />
                      {regData.password === regData.confirm_password
                        ? 'Passwords match'
                        : 'Passwords do not match'
                      }
                    </p>
                  )}

                  {/* Terms */}
                  <div className="flex items-start gap-2">
                    <input
                      name="agreeTerms"
                      type="checkbox"
                      checked={regData.agreeTerms}
                      onChange={handleChange(setRegData)}
                      className="h-4 w-4 mt-0.5 rounded bg-void-700 border-void-600 accent-violet-600"
                    />
                    <label className="text-xs text-gray-400 leading-relaxed">
                      I agree to the{' '}
                      <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
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