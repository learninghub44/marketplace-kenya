"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Eye, EyeOff, Loader2, CheckCircle, User, Mail, Phone, Lock } from 'lucide-react'
import { setAuth } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'', role:'buyer', phone:'' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Registration failed'); return }
      setAuth(data.token, data.user)
      setSuccess(true)
      setTimeout(() => router.push(data.user.role === 'seller' ? '/seller' : '/buyer'), 2000)
    } catch { setError('Connection failed. Please try again.') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-black text-gray-900">Account Created!</h2>
        <p className="text-gray-500 text-sm">Check your email for a welcome message. Redirecting you now...</p>
        <div className="w-full bg-orange-100 rounded-full h-1.5"><div className="bg-orange-400 h-1.5 rounded-full animate-pulse w-3/4" /></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-gray-900 py-3 px-4"><Link href="/" className="flex items-center gap-2 w-fit mx-auto"><ShoppingBag className="h-6 w-6 text-orange-400"/><span className="font-black text-orange-400 text-lg">Sokoni Kenya</span></Link></nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-center">
              <h1 className="text-2xl font-black text-white">Create Free Account</h1>
              <p className="text-gray-400 text-sm mt-1">Join 50,000+ Kenyans on the marketplace</p>
            </div>
            <div className="p-8">
              {/* Role Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                {['buyer','seller'].map(r => (
                  <button key={r} type="button" onClick={() => setForm({...form, role:r})}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors ${form.role===r ? 'bg-orange-400 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {r === 'buyer' ? '🛒 I want to Buy' : '🏪 I want to Sell'}
                  </button>
                ))}
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="John Kamau" />
                  </div></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="you@email.com" />
                  </div></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                  <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="+254 700 000 000" />
                  </div></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength={8} className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Min. 8 characters" />
                    <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>
                  </div></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                  <input type="password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Repeat your password" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-black py-3 rounded-lg flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin"/>Creating account...</> : 'Create Free Account'}
                </button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-500">
                Already have an account? <Link href="/login" className="text-orange-500 font-semibold">Sign in</Link>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            Need help? <Link href="/support" className="text-orange-500">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
