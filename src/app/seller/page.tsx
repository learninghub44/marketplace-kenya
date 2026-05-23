"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Plus, Package, Eye, Trash2, LogOut, Clock, CheckCircle, XCircle, Loader2, MessageCircle } from 'lucide-react'
import { getUser, clearAuth, authHeaders } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700', inactive: 'bg-gray-100 text-gray-600',
  }
  const icons: Record<string, any> = { active: CheckCircle, pending: Clock, rejected: XCircle }
  const Icon = icons[status]
  return <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
    {Icon && <Icon className="h-3 w-3" />}{status}
  </span>
}

export default function SellerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = getUser()
    if (!u || u.role !== 'seller') { router.push('/login'); return }
    setUser(u); fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/listings/my`, { headers: authHeaders() })
      const data = await res.json()
      if (data.success) setListings(data.listings || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    await fetch(`${API_BASE}/api/listings/${id}`, { method: 'DELETE', headers: authHeaders() })
    fetchListings()
  }

  const logout = () => { clearAuth(); router.push('/login') }

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    pending: listings.filter(l => l.status === 'pending').length,
    rejected: listings.filter(l => l.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-orange-400" />
            <span className="font-black text-orange-400">Sokoni Kenya</span>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">SELLER</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/listings" className="text-gray-400 hover:text-white text-sm hidden sm:block">Browse</Link>
            <Link href="/support" className="text-gray-400 hover:text-white text-sm hidden sm:block">Support</Link>
            <button onClick={logout} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm"><LogOut className="h-4 w-4" />Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-black">Welcome back, {user?.name || user?.email?.split('@')[0]}! 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your listings and track performance</p>
          <Link href="/seller/listings/create" className="mt-4 inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-5 py-2.5 rounded-lg transition-colors">
            <Plus className="h-4 w-4" />Create New Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-900' },
            { label: 'Live', value: stats.active, color: 'text-green-600' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Listings */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-black text-gray-900">Your Listings</h2>
            <Link href="/seller/listings/create" className="flex items-center gap-1 bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-3 py-1.5 rounded-lg text-sm">
              <Plus className="h-3.5 w-3.5" />Add New
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-orange-400" /></div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 px-6">
              <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No listings yet</h3>
              <p className="text-gray-500 text-sm mt-2">Create your first listing and start selling to thousands of Kenyan buyers.</p>
              <Link href="/seller/listings/create" className="mt-4 inline-block bg-orange-400 text-gray-900 font-bold px-6 py-3 rounded-lg">Create First Listing</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {listings.map(listing => (
                <div key={listing.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {listing.images?.[0] ? (
                    <img src={listing.images[0]} alt={listing.title} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"><Package className="h-6 w-6 text-gray-300" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{listing.title}</h3>
                    <p className="text-orange-500 font-black text-sm">KES {listing.price?.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">{statusBadge(listing.status)}<span className="text-xs text-gray-400">{listing.category}</span></div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href="/listings" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="h-4 w-4" /></Link>
                    <button onClick={() => deleteListing(listing.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900">Need Help?</h3>
            <p className="text-sm text-gray-500 mt-0.5">Contact our support team via WhatsApp or submit a ticket</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-sm">
              <MessageCircle className="h-4 w-4" />WhatsApp
            </a>
            <Link href="/support" className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-lg text-sm">Support</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
