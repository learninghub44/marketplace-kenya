"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Heart, MessageCircle, Search, LogOut, Loader2, MapPin, Tag } from 'lucide-react'
import { getUser, clearAuth, authHeaders } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya-1.onrender.com'

export default function BuyerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('browse')

  useEffect(() => {
    const u = getUser()
    if (!u || u.role !== 'buyer') { router.push('/login'); return }
    setUser(u)
    fetchListings()
    fetchFavorites()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/listings?status=active&limit=20`)
      const data = await res.json()
      if (data.success) setListings(data.listings || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/favorites`, { headers: authHeaders() })
      const data = await res.json()
      if (data.success) setFavorites(data.favorites || [])
    } catch (e) { console.error(e) }
  }

  const removeFav = async (id: string) => {
    await fetch(`${API_BASE}/api/favorites/${id}`, { method: 'DELETE', headers: authHeaders() })
    fetchFavorites()
  }

  const logout = () => { clearAuth(); router.push('/login') }

  const filtered = listings.filter(l =>
    !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <ShoppingBag className="h-6 w-6 text-orange-400" />
            <span className="font-black text-orange-400 hidden sm:block">Sokoni Kenya</span>
          </Link>
          <div className="flex-1 flex">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="flex-1 px-4 py-2 text-sm text-gray-900 rounded-l-lg focus:outline-none" />
            <button className="bg-orange-400 px-4 py-2 rounded-r-lg"><Search className="h-4 w-4 text-gray-900" /></button>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full hidden sm:block">BUYER</span>
            <button onClick={logout} className="text-gray-400 hover:text-white"><LogOut className="h-5 w-5" /></button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-5">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">Hi, {user?.name || user?.email?.split('@')[0]}! 👋</h1>
            <p className="text-gray-400 text-sm mt-0.5">Discover great deals from Kenyan sellers</p>
          </div>
          <Link href="/support" className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors">Help</Link>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm gap-1">
          {[{key:'browse', label:'Browse Listings', icon: ShoppingBag}, {key:'favorites', label:`Saved (${favorites.length})`, icon: Heart}].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors ${tab===t.key ? 'bg-orange-400 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </div>

        {/* Browse */}
        {tab === 'browse' && (
          loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-400" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="font-bold text-gray-900">No results for "{search}"</h3>
              <button onClick={() => setSearch('')} className="mt-3 text-orange-500 text-sm underline">Clear search</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(listing => (
                <div key={listing.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative">
                    {listing.images?.[0] ? (
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-36 bg-gray-100 flex items-center justify-center"><Tag className="h-8 w-8 text-gray-300" /></div>
                    )}
                    <span className="absolute top-2 left-2 bg-gray-900/70 text-white text-xs px-2 py-0.5 rounded">{listing.category}</span>
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">{listing.title}</h3>
                    <p className="text-orange-500 font-black">KES {listing.price?.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.location}</p>
                    <a href={`https://wa.me/254701059192?text=Hi, I'm interested in: ${listing.title} (KES ${listing.price})`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg font-semibold mt-1">
                      <MessageCircle className="h-3 w-3" />Contact Seller
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Favorites */}
        {tab === 'favorites' && (
          favorites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No saved items</h3>
              <p className="text-gray-500 text-sm mt-2">Tap the heart on any listing to save it here</p>
              <button onClick={() => setTab('browse')} className="mt-4 bg-orange-400 text-gray-900 font-bold px-6 py-2 rounded-lg text-sm">Browse Listings</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favorites.map((fav: any) => (
                <div key={fav.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  {fav.listings?.images?.[0] && <img src={fav.listings.images[0]} alt={fav.listings?.title} className="w-full h-32 object-cover" />}
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{fav.listings?.title}</h3>
                    <p className="text-orange-500 font-black text-sm">KES {fav.listings?.price?.toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                      <a href={`https://wa.me/254701059192?text=Hi, interested in: ${fav.listings?.title}`} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center bg-green-600 text-white text-xs py-1.5 rounded font-semibold">
                        <MessageCircle className="h-3 w-3 mr-1" />Contact
                      </a>
                      <button onClick={() => removeFav(fav.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded"><Heart className="h-4 w-4 fill-red-400" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <footer className="mt-10 bg-gray-900 text-white py-6 text-center text-sm">
        <p className="text-gray-400">© 2026 Sokoni Kenya · <Link href="/support" className="text-orange-400">Support</Link> · <a href="https://wa.me/254701059192" className="text-orange-400">WhatsApp</a></p>
      </footer>
    </div>
  )
}
