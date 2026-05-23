"use client"
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else setError(data.error || 'Failed to send reset email')
    } catch { setError('Connection failed. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-gray-900 py-3 px-4"><Link href="/" className="flex items-center gap-2 w-fit mx-auto"><ShoppingBag className="h-6 w-6 text-orange-400" /><span className="font-black text-orange-400 text-lg">Sokoni Kenya</span></Link></nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-center">
            <Mail className="h-10 w-10 text-orange-400 mx-auto mb-3" />
            <h1 className="text-2xl font-black text-white">Forgot Password?</h1>
            <p className="text-gray-400 text-sm mt-1">We'll email you a reset link</p>
          </div>
          <div className="p-8">
            {sent ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-xl font-bold">Check your email!</h2>
                <p className="text-gray-500 text-sm">If <strong>{email}</strong> is registered, a reset link is on its way.</p>
                <Link href="/login" className="inline-block bg-orange-400 text-gray-900 font-bold px-6 py-3 rounded-lg">Back to Login</Link>
              </div>
            ) : (
              <>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm" placeholder="your@email.com" /></div>
                  <button type="submit" disabled={loading} className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-black py-3 rounded-lg flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : 'Send Reset Link'}
                  </button>
                </form>
                <div className="mt-4 text-center"><Link href="/login" className="text-sm text-orange-500 flex items-center justify-center gap-1"><ArrowLeft className="h-4 w-4" />Back to login</Link></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
