'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useAuth } from '@clerk/nextjs'
import { ShoppingBag, Store, Loader2, Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya-1.onrender.com'

export default function OnboardingPage() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const clerkToken = await getToken()
      const res = await fetch(`${API}/api/auth/clerk-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clerkToken}` },
        body: JSON.stringify({ clerk_id: user!.id, email: user!.primaryEmailAddress?.emailAddress, name: user!.fullName, avatar_url: user!.imageUrl, phone, role }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Setup failed'); return }
      localStorage.setItem('km_token', data.token)
      localStorage.setItem('km_user', JSON.stringify(data.user))
      router.push(role === 'seller' ? '/seller' : '/buyer')
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Welcome{user?.firstName ? `, ${user.firstName}` : ''}! 👋</h1>
          <p className="text-gray-500 mt-1 text-sm">How would you like to use Sokoni Kenya?</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {[{ r: 'buyer' as const, icon: ShoppingBag, title: 'Buy', desc: 'Browse & buy products' },
              { r: 'seller' as const, icon: Store, title: 'Sell', desc: 'List & sell products' }].map(({ r, icon: Icon, title, desc }) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all ${role === r ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                {role === r && <span className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"><Check className="h-3 w-3 text-white" /></span>}
                <div className={`p-3 rounded-xl ${role === r ? 'bg-orange-500' : 'bg-gray-100'}`}><Icon className={`h-6 w-6 ${role === r ? 'text-white' : 'text-gray-500'}`} /></div>
                <p className={`font-bold text-sm ${role === r ? 'text-orange-600' : 'text-gray-700'}`}>{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Setting up…</> : `Continue as ${role === 'seller' ? 'Seller' : 'Buyer'} →`}
          </button>
        </form>
      </div>
    </div>
  )
}
