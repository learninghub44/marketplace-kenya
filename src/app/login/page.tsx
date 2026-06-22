"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Eye, EyeOff, Loader2, AlertCircle, Lock, Mail } from 'lucide-react'
import { setAuth } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Login failed'); return }
      setAuth(data.token, data.user)
      const dest = data.user.role === 'admin' ? '/admin' : data.user.role === 'seller' ? '/seller' : '/buyer'
      router.push(dest)
    } catch { setError('Connection failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Nav */}
      <nav className="bg-gray-900 py-3 px-4">
        <Link href="/" className="flex items-center gap-2 w-fit mx-auto">
          <ShoppingBag className="h-6 w-6 text-orange-400" />
          <span className="font-black text-orange-400 text-lg">Sokoni Kenya</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-center">
              <Lock className="h-10 w-10 text-orange-400 mx-auto mb-3" />
              <h1 className="text-2xl font-black text-white">Sign In</h1>
              <p className="text-gray-400 text-sm mt-1">Welcome back to Sokoni Kenya</p>
            </div>

            <div className="p-8">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      placeholder="Your password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-right mt-1">
                    <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 font-medium">Forgot password?</Link>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-orange-500 hover:text-orange-600 font-semibold">Create one free</Link>
              </div>

              <div className="mt-4 bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-center text-gray-600">
                 <strong>Sellers</strong> can list products for free · <strong>Buyers</strong> browse and message sellers
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Need help? <Link href="/support" className="text-orange-500">Contact Support</Link> or WhatsApp <strong>0701 059 192</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
