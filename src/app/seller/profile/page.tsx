"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Save, Loader2, CheckCircle, User, Phone, MapPin, Store } from 'lucide-react'
import { getUser, authHeaders } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function SellerProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({ business_name:'', phone:'', location:'', description:'' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const u = getUser()
    if (!u || u.role !== 'seller') { router.push('/login'); return }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/seller/profile`, { headers: authHeaders() })
      const data = await res.json()
      if (data.success && data.profile) {
        setForm({ business_name: data.profile.business_name || '', phone: data.profile.phone || '', location: data.profile.location || '', description: data.profile.description || '' })
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/seller/profile`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
      else setError(data.error || 'Failed to save')
    } catch { setError('Connection failed') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-400" /></div>

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
          <ShoppingBag className="h-6 w-6 text-orange-400" />
          <span className="font-black text-orange-400">Seller Profile</span>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-center">
            <div className="w-16 h-16 bg-orange-400/20 border-2 border-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Store className="h-8 w-8 text-orange-400" />
            </div>
            <h1 className="text-xl font-black text-white">Your Seller Profile</h1>
            <p className="text-gray-400 text-sm mt-1">Buyers see this info when they view your listings</p>
          </div>
          <div className="p-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
            {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4" />Profile saved!</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Business / Shop Name</label>
                <div className="relative"><Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={form.business_name} onChange={e=>setForm({...form,business_name:e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g. Kamau Electronics" />
                </div></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Phone / WhatsApp</label>
                <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="+254 700 000 000" />
                </div></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g. Nairobi, Westlands" />
                </div></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">About Your Business</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  placeholder="Tell buyers about your business, what you sell, and why they should buy from you..." />
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-black py-3 rounded-lg flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save Profile</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
