"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Eye, EyeOff, Loader2, AlertCircle, Lock, Mail } from 'lucide-react'
import { setAuth } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retries, setRetries] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 20000) // 20s timeout
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      })
      clearTimeout(timer)
      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Invalid email or password')
        return
      }
      setAuth(data.token, data.user)
      const dest = data.user.role === 'admin' ? '/admin' : data.user.role === 'seller' ? '/seller' : '/buyer'
      router.push(dest)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Server is still starting up. Please wait a moment and try again.')
      } else if (err.message?.includes('fetch')) {
        setError('Cannot reach server. Please check your internet connection and try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
      setRetries(r => r + 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <nav className="bg-gray-900 py-3 px-4">
        <Link href="/" className="flex items-center gap-2 w-fit mx-auto">
          <div className="bg-orange-400 p-1.5 rounded-lg"><ShoppingBag className="h-5 w-5 text-gray-900" /></div>
          <span className="font-black text-white">Sokoni<span className="text-orange-400"> Kenya</span></span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Non-blocking warm-up indicator */}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-center">
              <Lock className="h-10 w-10 text-orange-400 mx-auto mb-3" />
              <h1 className="text-2xl font-black text-white">Sign In</h1>
              <p className="text-gray-400 text-sm mt-1">Welcome back to Sokoni Kenya</p>
            </div>

            <div className="p-8">
              {error && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 mb-4 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{error}</p>
                    {retries >= 2 && (
                      <p className="text-xs mt-1 opacity-75">
                        Still failing? The server may need a minute to start.{' '}
                        <a href="https://wa.me/254701059192" className="underline" target="_blank" rel="noopener noreferrer">Contact support</a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      placeholder="Your password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-right mt-1">
                    <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 font-medium">Forgot password?</Link>
                  </div>
                </div>

                {/* Button is NEVER disabled — always lets user try */}
                <button type="submit" disabled={loading}
                  className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  {loading
                    ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</>
                    : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-orange-500 hover:text-orange-600 font-semibold">Create one free</Link>
              </div>

              <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-lg p-3 text-xs text-center text-gray-600 dark:text-gray-400">
                🛒 <strong>Sellers</strong> list free · <strong>Buyers</strong> browse &amp; contact sellers · <strong>Admin</strong> full access
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Need help?{' '}
            <Link href="/support" className="text-orange-500">Support Center</Link>
            {' '}· WhatsApp{' '}
            <a href="https://wa.me/254701059192" className="text-orange-500" target="_blank" rel="noopener noreferrer">0701 059 192</a>
          </p>
        </div>
      </div>
    </div>
  )
}
