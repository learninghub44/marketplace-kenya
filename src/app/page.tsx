import Link from 'next/link'
import { ArrowRight, Search, ShoppingBag, Star, TrendingUp, Shield, Truck, Tag } from 'lucide-react'

const categories = [
  { name: 'Electronics', emoji: '📱', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80', count: '2,400+ items', color: 'from-blue-500 to-cyan-400' },
  { name: 'Fashion', emoji: '👗', image: 'https://images.unsplash.com/photo-1558171813-c57e21d86b46?w=400&q=80', count: '5,100+ items', color: 'from-pink-500 to-rose-400' },
  { name: 'Home & Garden', emoji: '🏡', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', count: '1,800+ items', color: 'from-green-500 to-emerald-400' },
  { name: 'Vehicles', emoji: '🚗', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80', count: '900+ items', color: 'from-orange-500 to-amber-400' },
  { name: 'Property', emoji: '🏢', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80', count: '650+ items', color: 'from-purple-500 to-violet-400' },
  { name: 'Agriculture', emoji: '🌾', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80', count: '1,200+ items', color: 'from-lime-500 to-green-400' },
  { name: 'Baby & Kids', emoji: '🧸', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80', count: '780+ items', color: 'from-yellow-400 to-orange-300' },
  { name: 'Sports', emoji: '⚽', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', count: '430+ items', color: 'from-red-500 to-orange-400' },
]

const featuredDeals = [
  { name: 'Samsung Galaxy A55', price: 'KES 42,000', originalPrice: 'KES 52,000', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80', category: 'Electronics', badge: 'Hot Deal', rating: 4.8, reviews: 124 },
  { name: 'Ladies Summer Dress', price: 'KES 2,500', originalPrice: 'KES 4,000', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80', category: 'Fashion', badge: 'New', rating: 4.6, reviews: 87 },
  { name: 'Modern Sofa Set', price: 'KES 38,000', originalPrice: 'KES 48,000', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80', category: 'Home', badge: 'Popular', rating: 4.9, reviews: 56 },
  { name: 'iPhone 14 Pro', price: 'KES 115,000', originalPrice: 'KES 130,000', image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=300&q=80', category: 'Electronics', badge: 'Top Pick', rating: 5.0, reviews: 203 },
  { name: 'Fresh Avocados (1kg)', price: 'KES 150', originalPrice: 'KES 200', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80', category: 'Agriculture', badge: 'Fresh', rating: 4.7, reviews: 312 },
  { name: 'Mountain Bike', price: 'KES 18,500', originalPrice: 'KES 24,000', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&q=80', category: 'Sports', badge: 'Sale', rating: 4.5, reviews: 44 },
]

const benefits = [
  { icon: Tag, title: 'Free to List', desc: 'Post unlimited products at zero cost. No hidden fees, ever.' },
  { icon: Shield, title: 'Verified Sellers', desc: 'All sellers go through admin review before listings go live.' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Connect with buyers and sellers across all 47 counties.' },
  { icon: TrendingUp, title: 'M-Pesa Payments', desc: 'Pay securely via M-Pesa. Fast, trusted, and Kenyan.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Nav Bar - Amazon Style */}
      <nav className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <ShoppingBag className="h-7 w-7 text-orange-400" />
            <div>
              <span className="font-black text-lg text-orange-400 leading-none">Kenya</span>
              <span className="block text-xs text-gray-300 leading-none">Marketplace</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 flex max-w-2xl">
            <input
              type="text"
              placeholder="Search products, categories, sellers..."
              className="flex-1 px-4 py-2 text-gray-900 text-sm rounded-l-md focus:outline-none"
            />
            <Link href="/listings" className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-r-md flex items-center">
              <Search className="h-5 w-5 text-gray-900" />
            </Link>
          </div>

          <div className="flex items-center gap-3 text-sm flex-shrink-0">
            <Link href="/login" className="hover:text-orange-400 hidden sm:block">Sign In</Link>
            <Link href="/register" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-semibold px-3 py-1.5 rounded-md text-xs">
              Start Selling
            </Link>
          </div>
        </div>

        {/* Category nav strip */}
        <div className="bg-gray-800 border-t border-gray-700">
          <div className="container mx-auto px-4 flex gap-1 overflow-x-auto py-1.5 text-xs scrollbar-hide">
            {categories.map(c => (
              <Link key={c.name} href="/listings" className="whitespace-nowrap px-3 py-1 hover:text-orange-400 hover:bg-gray-700 rounded transition-colors">
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-orange-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80')", backgroundSize: 'cover', backgroundPosition: 'center'}} />
        <div className="relative container mx-auto px-4 py-14 lg:py-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="text-white space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-orange-400/20 border border-orange-400/40 rounded-full px-4 py-1.5 text-orange-300 text-sm font-medium">
              🇰🇪 Kenya&apos;s #1 Local Marketplace
            </div>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight">
              Buy & Sell<br />
              <span className="text-orange-400">Anything</span> in Kenya
            </h1>
            <p className="text-gray-300 text-lg">
              Join 50,000+ Kenyans buying and selling electronics, fashion, property, vehicles and more — safely and for free.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/listings"
                className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
                Browse Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/register"
                className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Sell for Free
              </Link>
            </div>
            <div className="flex gap-6 text-sm text-gray-300 pt-2">
              <span>✅ Free listings</span>
              <span>✅ M-Pesa payments</span>
              <span>✅ 47 counties</span>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3 w-80">
            {[
              { label: '50K+', sub: 'Active Users' },
              { label: '120K+', sub: 'Products Listed' },
              { label: '47', sub: 'Counties Covered' },
              { label: 'Free', sub: 'Forever to List' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white text-center">
                <p className="text-2xl font-black text-orange-400">{s.label}</p>
                <p className="text-xs text-gray-300 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Strip */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4">
                <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                  <Icon className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-10">

        {/* Shop by Category */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">Shop by Category</h2>
            <Link href="/listings" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link key={cat.name} href="/listings"
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="relative h-20 overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-40`} />
                  <span className="absolute top-2 left-2 text-xl">{cat.emoji}</span>
                </div>
                <div className="p-2">
                  <p className="text-xs font-bold text-gray-900 leading-tight">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Deals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-gray-900">Today&apos;s Deals</h2>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
            </div>
            <Link href="/listings" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
              See all deals <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredDeals.map((item) => {
              const discount = Math.round((1 - parseInt(item.price.replace(/\D/g, '')) / parseInt(item.originalPrice.replace(/\D/g, ''))) * 100)
              return (
                <Link key={item.name} href="/listings"
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      -{discount}%
                    </span>
                    <span className="absolute top-2 right-2 bg-orange-400 text-gray-900 text-xs font-bold px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-xs text-gray-400">{item.category}</p>
                    <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                      <span className="text-xs text-gray-600">{item.rating} ({item.reviews})</span>
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900">{item.price}</p>
                      <p className="text-xs text-gray-400 line-through">{item.originalPrice}</p>
                    </div>
                    <button className="w-full bg-orange-400 hover:bg-orange-500 text-gray-900 text-xs font-bold py-1.5 rounded-lg transition-colors mt-1">
                      View Deal
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Sell Banner */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between p-8 gap-6">
            <div className="text-white space-y-2">
              <p className="text-orange-400 font-semibold text-sm uppercase tracking-wide">For Sellers</p>
              <h3 className="text-2xl lg:text-3xl font-black">Start Selling Today</h3>
              <p className="text-gray-300 max-w-sm">
                List your products for free. Reach thousands of buyers across Kenya. Get paid via M-Pesa instantly.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/register"
                className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-black px-8 py-3 rounded-lg text-center transition-colors">
                Create Free Account
              </Link>
              <Link href="/login"
                className="border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-lg text-center font-semibold transition-colors text-sm">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Cities */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">Browse by Location</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { city: 'Nairobi', image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=200&q=80' },
              { city: 'Mombasa', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=200&q=80' },
              { city: 'Kisumu', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&q=80' },
              { city: 'Nakuru', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=200&q=80' },
              { city: 'Eldoret', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&q=80' },
              { city: 'All Kenya', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=200&q=80' },
            ].map(({ city, image }) => (
              <Link key={city} href="/listings"
                className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <img src={image} alt={city} className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-bold">{city}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="h-6 w-6 text-orange-400" />
              <span className="font-black text-lg text-orange-400">Kenya Marketplace</span>
            </div>
            <p className="text-gray-400">Kenya&apos;s free platform for buyers and sellers across all 47 counties.</p>
            <p className="text-gray-400 mt-2">📞 WhatsApp: 0742 791 838</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-orange-400">Marketplace</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/listings" className="hover:text-white transition-colors">Browse Listings</Link></li>
              <li><Link href="/seller" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
              <li><Link href="/buyer" className="hover:text-white transition-colors">Buyer Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-orange-400">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-orange-400">Trust & Safety</h4>
            <ul className="space-y-2 text-gray-400">
              <li>✅ Admin-reviewed listings</li>
              <li>✅ M-Pesa secure payments</li>
              <li>✅ Seller verification</li>
              <li>✅ Buyer protection</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
          © 2026 Kenya Marketplace · Free for everyone · Built in Kenya 🇰🇪
        </div>
      </footer>

    </div>
  )
}
