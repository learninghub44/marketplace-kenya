'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, ShoppingCart, Star, Zap, Shield, Truck, RotateCcw, Headphones, ChevronRight, Tag, TrendingUp, Award } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const CATEGORIES = [
  { name: 'Electronics',     emoji: '📱', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&q=80',  bg: 'from-blue-500 to-blue-700' },
  { name: 'Fashion',         emoji: '👗', image: 'https://images.unsplash.com/photo-1558171813-c57e21d86b46?w=300&q=80',  bg: 'from-pink-500 to-pink-700' },
  { name: 'Home & Garden',   emoji: '🏡', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80',  bg: 'from-green-500 to-green-700' },
  { name: 'Vehicles',        emoji: '🚗', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&q=80', bg: 'from-gray-600 to-gray-800' },
  { name: 'Health & Beauty', emoji: '💄', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80', bg: 'from-rose-500 to-rose-700' },
  { name: 'Agriculture',     emoji: '🌾', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&q=80', bg: 'from-lime-600 to-lime-800' },
  { name: 'Sports',          emoji: '⚽', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&q=80', bg: 'from-orange-500 to-orange-700' },
  { name: 'Baby & Kids',     emoji: '🍼', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80', bg: 'from-yellow-400 to-yellow-600' },
  { name: 'Property',        emoji: '🏢', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&q=80',  bg: 'from-sky-500 to-sky-700' },
  { name: 'Services',        emoji: '💼', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&q=80', bg: 'from-purple-500 to-purple-700' },
]

const FLASH_PRODUCTS = [
  { id: '1', title: 'Samsung Galaxy A15 — 6.5" Display, 4GB RAM', price: 18500, original: 24000, discount: 23, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', category: 'Electronics', rating: 4.5, reviews: 128 },
  { id: '2', title: 'Nike Air Max Running Shoes — Men\'s Size 40-45', price: 7200, original: 12000, discount: 40, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', category: 'Fashion', rating: 4.7, reviews: 89 },
  { id: '3', title: 'Portable Bluetooth Speaker — 360° Sound, Waterproof', price: 2800, original: 4500, discount: 38, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', category: 'Electronics', rating: 4.3, reviews: 214 },
  { id: '4', title: 'Women\'s Floral Maxi Dress — Multiple Colors', price: 1500, original: 2800, discount: 46, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80', category: 'Fashion', rating: 4.6, reviews: 301 },
  { id: '5', title: 'Stainless Steel Cookware Set — 7 Piece Non-Stick', price: 4200, original: 6800, discount: 38, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', category: 'Home & Garden', rating: 4.4, reviews: 76 },
  { id: '6', title: 'HP Laptop 14" — Intel i5, 8GB RAM, 256GB SSD', price: 52000, original: 68000, discount: 24, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', category: 'Electronics', rating: 4.8, reviews: 52 },
]

const SERVICES = [
  { icon: Truck,       title: 'Islandwide Delivery',  desc: 'Delivered to all 47 counties' },
  { icon: RotateCcw,   title: 'Easy Returns',         desc: 'Return within 7 days — hassle free' },
  { icon: Shield,      title: 'Safe Transactions',     desc: 'Buyer & seller agree on payment' },
  { icon: Headphones,  title: '24/7 Support',         desc: 'WhatsApp & email support' },
]

function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 }
        return { h: 5, m: 59, s: 59 }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="flex items-center gap-1">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-gray-900 text-white text-xs font-black px-2 py-1 rounded font-mono min-w-[28px] text-center">{v}</span>
          {i < 2 && <span className="text-gray-900 font-black text-sm">:</span>}
        </span>
      ))}
    </div>
  )
}

function FlashProductCard({ product }: { product: typeof FLASH_PRODUCTS[0] }) {
  const [added, setAdded] = useState(false)
  return (
    <Link href={`/listings?search=${encodeURIComponent(product.title.split('—')[0].trim())}`}
      className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <img src={product.image} alt={product.title}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded">
          -{product.discount}%
        </span>
      </div>
      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors">
          {product.title}
        </h3>
        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-3 w-3 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
            ))}
          </div>
          <span className="text-[11px] text-gray-400">({product.reviews})</span>
        </div>
        {/* Price */}
        <div className="mt-auto pt-1">
          <p className="text-base font-black text-gray-900">KES {product.price.toLocaleString()}</p>
          <p className="text-xs text-gray-400 line-through">KES {product.original.toLocaleString()}</p>
        </div>
        <button
          onClick={e => { e.preventDefault(); setAdded(true); setTimeout(() => setAdded(false), 2000) }}
          className={`mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${
            added ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Navbar showSearch />

      <main className="flex-1">

        {/* ── HERO BANNER ─────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80')", backgroundSize: 'cover' }} />
          <div className="relative container mx-auto px-4 py-10 lg:py-14 flex flex-col lg:flex-row items-center gap-8 max-w-6xl">
            {/* Text */}
            <div className="text-white flex-1 text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold">
                🇰🇪 Kenya&apos;s Fastest Growing Marketplace
              </div>
              <h1 className="text-3xl lg:text-5xl font-black leading-tight">
                Shop Smarter,<br />
                <span className="text-yellow-300">Save More</span> Every Day
              </h1>
              <p className="text-white/85 text-base lg:text-lg max-w-md">
                Over 120,000 products from verified sellers across all 47 counties. Pay securely with M-Pesa.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-1">
                <Link href="/listings"
                  className="bg-white text-orange-600 hover:bg-yellow-50 font-black px-6 py-3 rounded-full flex items-center gap-2 transition-colors shadow-lg">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/register"
                  className="border-2 border-white/60 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-full transition-colors">
                  Start Selling Free
                </Link>
              </div>
            </div>
            {/* Stats grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3 flex-shrink-0 w-72">
              {[
                { n: '120K+', l: 'Products' },
                { n: '50K+',  l: 'Happy Buyers' },
                { n: '47',    l: 'Counties' },
                { n: '100%',  l: 'Secure' },
              ].map(s => (
                <div key={s.l} className="bg-white/15 backdrop-blur border border-white/25 rounded-2xl p-4 text-center text-white">
                  <p className="text-2xl font-black text-yellow-300">{s.n}</p>
                  <p className="text-xs text-white/75 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SERVICE PROMISES ────────────────────────────────── */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
              {SERVICES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3 px-5 py-4">
                  <div className="bg-orange-50 p-2.5 rounded-xl flex-shrink-0">
                    <Icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ────────────────────────────────────── */}
        <div className="container mx-auto px-4 py-6 max-w-6xl space-y-8">

          {/* ── CATEGORIES ──────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-black text-gray-900">Shop by Category</h2>
              </div>
              <Link href="/listings" className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1">
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {CATEGORIES.map(cat => (
                <Link key={cat.name}
                  href={`/listings?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col items-center gap-1.5 bg-white hover:bg-orange-50 rounded-xl p-2.5 border border-gray-100 hover:border-orange-200 transition-all text-center">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cat.bg} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>
                    {cat.emoji}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700 group-hover:text-orange-600 leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── PROMOTIONAL BANNERS ─────────────────────────── */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/listings?category=Electronics"
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900 p-6 flex flex-col justify-between min-h-[140px] hover:shadow-xl transition-shadow group lg:col-span-1">
              <div className="text-white space-y-1 z-10 relative">
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Best Deals</p>
                <p className="text-xl font-black leading-tight">Top Electronics<br />Up to <span className="text-yellow-300">50% Off</span></p>
                <p className="text-xs text-blue-200">Phones, Laptops, TVs</p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit transition-colors z-10 relative">
                Shop Now <ArrowRight className="h-3 w-3" />
              </span>
              <span className="absolute right-4 bottom-4 text-7xl opacity-20 select-none">📱</span>
            </Link>
            <Link href="/listings?category=Fashion"
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500 to-rose-700 p-6 flex flex-col justify-between min-h-[140px] hover:shadow-xl transition-shadow group">
              <div className="text-white space-y-1 z-10 relative">
                <p className="text-xs font-semibold text-pink-200 uppercase tracking-wider">New Arrivals</p>
                <p className="text-xl font-black leading-tight">Fashion & Style<br />From <span className="text-yellow-300">KES 500</span></p>
                <p className="text-xs text-pink-200">Clothing, Shoes, Bags</p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit transition-colors z-10 relative">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
              <span className="absolute right-4 bottom-4 text-7xl opacity-20 select-none">👗</span>
            </Link>
            <Link href="/register"
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 p-6 flex flex-col justify-between min-h-[140px] hover:shadow-xl transition-shadow group sm:col-span-2 lg:col-span-1">
              <div className="text-white space-y-1 z-10 relative">
                <p className="text-xs font-semibold text-orange-100 uppercase tracking-wider">For Sellers</p>
                <p className="text-xl font-black leading-tight">Start Selling<br /><span className="text-yellow-200">100% Free</span></p>
                <p className="text-xs text-orange-100">No commission. No fees. Ever.</p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit transition-colors z-10 relative">
                Get Started <ArrowRight className="h-3 w-3" />
              </span>
              <span className="absolute right-4 bottom-4 text-7xl opacity-20 select-none">🛒</span>
            </Link>
          </section>

          {/* ── FLASH SALES ─────────────────────────────────── */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-orange-600">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Zap className="h-5 w-5 text-white fill-white" />
                </div>
                <div>
                  <h2 className="font-black text-white text-lg">Flash Sales</h2>
                  <p className="text-orange-100 text-xs">Grab them before time runs out!</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CountdownTimer />
                <Link href="/listings" className="hidden sm:flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors">
                  See All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            {/* Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 divide-x divide-y divide-gray-100 p-0">
              {FLASH_PRODUCTS.map(p => (
                <div key={p.id} className="p-3">
                  <FlashProductCard product={p} />
                </div>
              ))}
            </div>
          </section>

          {/* ── FEATURES / WHY SOKONI ───────────────────────── */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Award className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-black text-gray-900">Why Shop on Sokoni Kenya?</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {[
                { emoji: '🔒', title: 'Safe & Secure',     desc: 'All sellers are reviewed and verified by our team before listing.' },
                { emoji: '📱', title: 'M-Pesa Payments',   desc: 'Pay instantly and securely via M-Pesa, card, or bank transfer.' },
                { emoji: '🚚', title: 'Fast Delivery',     desc: 'Get your orders delivered across all 47 counties in Kenya.' },
                { emoji: '💬', title: 'Chat with Sellers', desc: 'Message sellers directly on WhatsApp or our in-app chat.' },
              ].map(f => (
                <div key={f.title} className="text-center space-y-2">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto">{f.emoji}</div>
                  <p className="font-bold text-sm text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed hidden sm:block">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── TOP CITIES ──────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-black text-gray-900">Browse by Location</h2>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { city: 'Nairobi',   img: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&q=80' },
                { city: 'Mombasa',   img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&q=80' },
                { city: 'Kisumu',    img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80' },
                { city: 'Nakuru',    img: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&q=80' },
                { city: 'Eldoret',   img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&q=80' },
                { city: 'All Kenya', img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=300&q=80' },
              ].map(({ city, img }) => (
                <Link key={city} href={`/listings?location=${encodeURIComponent(city)}`}
                  className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <img src={img} alt={city} className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <p className="absolute bottom-0 left-0 right-0 text-center text-white text-xs font-bold py-2">{city}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── SELLER CTA ──────────────────────────────────── */}
          <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between p-8 gap-6">
              <div className="text-white space-y-2 text-center sm:text-left">
                <p className="text-orange-400 font-bold text-sm uppercase tracking-widest">For Sellers</p>
                <h3 className="text-2xl lg:text-3xl font-black">Reach Thousands of Buyers</h3>
                <p className="text-gray-400 max-w-sm text-sm">List your products for free. No hidden fees, no commission. Get paid directly via M-Pesa.</p>
                <div className="flex gap-4 justify-center sm:justify-start pt-1 text-sm text-gray-300 flex-wrap">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />Free forever</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />Direct M-Pesa</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />AI listing tools</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0 w-full sm:w-auto">
                <Link href="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3.5 rounded-xl text-center transition-colors shadow-lg">
                  Create Free Account
                </Link>
                <Link href="/login"
                  className="border border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white px-8 py-3 rounded-xl text-center text-sm font-semibold transition-colors">
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </section>

          {/* ── TESTIMONIALS ────────────────────────────────── */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-5 text-center">What Kenyans Are Saying</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: 'Mary W., Nairobi', text: 'Sold my old laptop in 2 days! Simple process and the buyer paid via M-Pesa instantly. Very smooth experience.', stars: 5, avatar: 'M' },
                { name: 'James K., Mombasa', text: 'Found exactly what I was looking for at a great price. Contacting the seller was easy and delivery was fast.', stars: 5, avatar: 'J' },
                { name: 'Aisha M., Kisumu', text: 'As a small business owner, Sokoni Kenya has brought me consistent new customers every single week. Highly recommend!', stars: 5, avatar: 'A' },
              ].map(t => (
                <div key={t.name} className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-sm">
                      {t.avatar}
                    </div>
                    <p className="text-xs font-bold text-gray-700">{t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* WhatsApp sticky button */}
      <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-xl flex items-center gap-2 z-40 transition-all group hover:pr-5">
        <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.094.543 4.065 1.497 5.782L0 24l6.387-1.671A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.64-.5-5.156-1.374l-.37-.22-3.792.993.996-3.717-.242-.385A9.934 9.934 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
        <span className="hidden group-hover:block text-sm font-semibold whitespace-nowrap">WhatsApp Support</span>
      </a>

      <Footer />
    </div>
  )
}
