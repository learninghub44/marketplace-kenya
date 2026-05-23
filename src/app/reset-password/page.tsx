"use client"
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Lock, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (data.success) setDone(true)
      else setError(data.error || 'Failed to reset password')
    } catch { setError('Connection failed.') }
    finally { setLoading(false) }
  }

  if (!token) return <div className="p-8 text-center text-red-600">Invalid reset link. <Link href="/forgot-password" className="underline">Request a new one</Link>.</div>

  return (
    <div className="p-8">
      {done ? (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold">Password updated!</h2>
          <p className="text-gray-500 text-sm">Your password has been reset successfully.</p>
          <button onClick={() => router.push('/login')} className="bg-orange-400 text-gray-900 font-bold px-6 py-3 rounded-lg">Go to Login</button>
        </div>
      ) : (
        <>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={8}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm" placeholder="Min. 8 characters" />
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>
              </div>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm" placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-black py-3 rounded-lg flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin"/>Updating...</> : 'Reset Password'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-gray-900 py-3 px-4"><Link href="/" className="flex items-center gap-2 w-fit mx-auto"><ShoppingBag className="h-6 w-6 text-orange-400"/><span className="font-black text-orange-400 text-lg">Sokoni Kenya</span></Link></nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-center">
            <Lock className="h-10 w-10 text-orange-400 mx-auto mb-3"/>
            <h1 className="text-2xl font-black text-white">Set New Password</h1>
          </div>
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}><ResetForm /></Suspense>
        </div>
      </div>
    </div>
  )
}
