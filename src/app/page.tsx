"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageCircle, Tag, Shield, Zap, TrendingUp, ChevronRight, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const BANNERS = [
  { bg: 'from-orange-500 to-orange-600', title: 'Buy & Sell Anything in Kenya', sub: 'The free local marketplace — no fees, no commissions', cta: 'Shop Now', href: '/listings' },
  { bg: 'from-gray-800 to-gray-900', title: 'Sell for Free Today', sub: 'List unlimited products, reach thousands of buyers', cta: 'Start Selling', href: '/register' },
  { bg: 'from-green-600 to-emerald-700', title: 'Pay via M-Pesa', sub: 'Fast, secure, trusted by 50,000+ Kenyans', cta: 'Learn More', href: '/support' },
]

const CATS = [
  { name: 'Phones & Tablets', icon: '📱', q: 'Electronics', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&q=80' },
  { name: 'Fashion', icon: '👗', q: 'Fashion', img: 'https://images.unsplash.com/photo-1558171813-c57e21d86b46?w=200&q=80' },
  { name: 'Home & Office', icon: '🏠', q: 'Home & Garden', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80' },
  { name: 'Vehicles', icon: '🚗', q: 'Vehicles', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=80' },
  { name: 'Agriculture', icon: '🌾', q: 'Agriculture', img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&q=80' },
  { name: 'Property', icon: '🏢', q: 'Property', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80' },
  { name: 'Sports', icon: '⚽', q: 'Sports', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&q=80' },
  { name: 'Health & Beauty', icon: '💊', q: 'Health & Beauty', img: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=200&q=80' },
]

const WHY = [
  { icon: Tag, title: '100% Free', desc: 'No listing fees, no commissions ever' },
  { icon: Shield, title: 'Verified', desc: 'Every listing reviewed by our team' },
  { icon: Zap, title: 'M-Pesa', desc: 'Instant secure mobile payments' },
  { icon: TrendingUp, title: '47 Counties', desc: 'Reach buyers across all of Kenya' },
]

export default function HomePage() {
  const [banner, setBanner] = useState(0)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setBanner(i => (i + 1) % BANNERS.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    fetch(`${API}/api/listings?status=active&limit=10`)
      .then(r => r.json()).then(d => { if (d.success) setListings(d.listings || []) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const b = BANNERS[banner]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-3 py-4 space-y-4">

        {/* Hero Banner */}
        <div className={`bg-gradient-to-r ${b.bg} rounded-2xl p-6 sm:p-10 flex items-center justify-between min-h-[160px] transition-all duration-500`}>
          <div className="text-white">
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">{b.title}</h1>
            <p className="text-white/80 mt-1 text-sm sm:text-base">{b.sub}</p>
            <Link href={b.href} className="inline-flex items-center gap-2 mt-4 bg-white text-gray-900 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-gray-100 transition-colors">
              {b.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="hidden sm:flex gap-1.5 flex-col">
            {BANNERS.map((_, i) => (
              <button key={i} onClick={() => setBanner(i)} className={`w-2 rounded-full transition-all ${i === banner ? 'h-6 bg-white' : 'h-2 bg-white/40'}`} />
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-gray-900 dark:text-white">Shop by Category</h2>
            <Link href="/listings" className="text-orange-500 text-xs font-semibold flex items-center gap-0.5">See All <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATS.map(cat => (
              <Link key={cat.name} href={`/listings?category=${encodeURIComponent(cat.q)}`} className="flex flex-col items-center gap-1.5 group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-700 group-hover:border-orange-400 transition-colors">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-xs text-center text-gray-600 dark:text-gray-400 group-hover:text-orange-500 leading-tight font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Listings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-orange-500 rounded-full" />
              <h2 className="font-black text-gray-900 dark:text-white">Latest Listings</h2>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
            </div>
            <Link href="/listings" className="text-orange-500 text-xs font-semibold flex items-center gap-0.5">See All <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-gray-100 dark:bg-gray-800">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 p-3 animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-36 mb-2" />
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 mb-1" />
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <p className="text-5xl mb-3">🛒</p>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">No listings yet</h3>
              <p className="text-gray-500 text-sm mt-1">Be the first to list a product!</p>
              <Link href="/register" className="inline-block mt-4 bg-orange-500 text-white font-bold px-6 py-2.5 rounded-full text-sm">Start Selling Free</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-gray-100 dark:bg-gray-800">
              {listings.map(l => (
                <Link key={l.id} href={`/listings/${l.id}`} className="bg-white dark:bg-gray-900 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors group block">
                  <div className="relative overflow-hidden">
                    {l.images?.[0] ? (
                      <img src={l.images[0]} alt={l.title} className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-36 sm:h-44 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Tag className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">{l.category?.slice(0,10)}</div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-tight mb-1">{l.title}</p>
                    <p className="font-black text-orange-500">KES {l.price?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5"><MapPin className="h-2.5 w-2.5" />{l.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Why Sokoni */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-orange-500 rounded-full" />
            <h2 className="font-black text-gray-900 dark:text-white">Why Sokoni Kenya?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WHY.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                <div className="bg-orange-500 p-2.5 rounded-xl"><Icon className="h-5 w-5 text-white" /></div>
                <p className="font-bold text-sm dark:text-white">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sell CTA */}
        <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="text-white flex-1">
            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">For Sellers</p>
            <h3 className="text-xl sm:text-2xl font-black">Start Selling Today — It's Free</h3>
            <p className="text-gray-400 text-sm mt-1">List products, reach thousands of buyers, get paid via M-Pesa.</p>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3 rounded-full text-center text-sm">Create Free Account →</Link>
            <Link href="/login" className="border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 px-8 py-3 rounded-full text-center text-sm">Already have an account</Link>
          </div>
        </div>

      </main>

      {/* WhatsApp float */}
      <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-xl z-40 hover:scale-110 transition-all flex items-center gap-2 group">
        <MessageCircle className="h-5 w-5" />
        <span className="hidden group-hover:block text-sm font-semibold pr-1 whitespace-nowrap">WhatsApp Us</span>
      </a>

      <Footer />
    </div>
  )
}
