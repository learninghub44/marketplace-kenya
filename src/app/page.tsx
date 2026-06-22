import Link from 'next/link'
import {
  ArrowRight, Tag, Shield, Globe, TrendingUp, Star, MessageCircle,
  Smartphone, Shirt, HomeIcon, Car, Sprout, Dumbbell, Baby, Building2,
  Briefcase, Heart, MapPin, CheckCircle, Users, Package, Search,
  Zap, CreditCard, BadgeCheck, ChevronRight, ShoppingBag, Truck
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const categories = [
  { name: 'Electronics', icon: Smartphone, color: 'bg-blue-600', light: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-600', count: '2,400+' },
  { name: 'Fashion', icon: Shirt, color: 'bg-rose-500', light: 'bg-rose-50 dark:bg-rose-950', text: 'text-rose-500', count: '5,100+' },
  { name: 'Home & Garden', icon: HomeIcon, color: 'bg-emerald-600', light: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-600', count: '1,800+' },
  { name: 'Vehicles', icon: Car, color: 'bg-orange-500', light: 'bg-orange-50 dark:bg-orange-950', text: 'text-orange-500', count: '900+' },
  { name: 'Property', icon: Building2, color: 'bg-violet-600', light: 'bg-violet-50 dark:bg-violet-950', text: 'text-violet-600', count: '650+' },
  { name: 'Agriculture', icon: Sprout, color: 'bg-green-600', light: 'bg-green-50 dark:bg-green-950', text: 'text-green-600', count: '1,200+' },
  { name: 'Sports', icon: Dumbbell, color: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-500', count: '430+' },
  { name: 'Services', icon: Briefcase, color: 'bg-teal-600', light: 'bg-teal-50 dark:bg-teal-950', text: 'text-teal-600', count: '320+' },
  { name: 'Baby & Kids', icon: Baby, color: 'bg-pink-500', light: 'bg-pink-50 dark:bg-pink-950', text: 'text-pink-500', count: '210+' },
  { name: 'Health & Beauty', icon: Heart, color: 'bg-red-500', light: 'bg-red-50 dark:bg-red-950', text: 'text-red-500', count: '580+' },
]

const stats = [
  { label: 'Active Users', value: '50K+', icon: Users, color: 'text-orange-400' },
  { label: 'Products Listed', value: '120K+', icon: Package, color: 'text-orange-400' },
  { label: 'Cities Covered', value: '47', icon: MapPin, color: 'text-orange-400' },
  { label: 'Always Free', value: 'Free', icon: CheckCircle, color: 'text-green-400' },
]

const howItWorks = [
  { step: '01', icon: BadgeCheck, title: 'Create an Account', desc: 'Sign up as a buyer or seller in under 60 seconds.' },
  { step: '02', icon: Tag, title: 'List or Browse', desc: 'Post your item free, or search thousands of verified listings.' },
  { step: '03', icon: MessageCircle, title: 'Connect Securely', desc: 'Chat with buyers or sellers directly via our platform.' },
  { step: '04', icon: CreditCard, title: 'Pay via M-Pesa', desc: 'Complete transactions safely using Kenya\'s trusted payment method.' },
]

const testimonials = [
  { name: 'Mary W.', location: 'Nairobi', text: 'Sold my laptop in 2 days. Simple process and the buyer paid via M-Pesa instantly.', stars: 5, role: 'Seller' },
  { name: 'James K.', location: 'Mombasa', text: 'Found exactly what I needed at a great price. Contacting the seller was easy.', stars: 5, role: 'Buyer' },
  { name: 'Aisha M.', location: 'Kisumu', text: 'As a small business owner, listing here brings me new customers every week.', stars: 5, role: 'Seller' },
]

const cities = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Machakos']

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar showSearch />

      {/* ── HERO ── */}
      <section className="relative bg-gray-900 overflow-hidden">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #ea580c 0%, transparent 40%),
                            radial-gradient(circle at 60% 80%, #c2410c 0%, transparent 40%)`
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative container mx-auto px-4 py-16 lg:py-24 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left copy */}
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 rounded-full px-4 py-1.5 text-orange-300 text-sm font-medium">
                <MapPin className="h-3.5 w-3.5" /> Kenya's Trusted Marketplace
              </div>
              <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Buy &amp; Sell<br />
                <span className="text-orange-400">Anything</span><br />
                in Kenya
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Join 50,000+ Kenyans trading electronics, fashion, property, vehicles and more — safely and for free.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/listings" className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105">
                  Browse Products <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/register" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold transition-all">
                  Start Selling Free
                </Link>
              </div>

              <div className="flex flex-wrap gap-5 text-sm text-gray-400 pt-2">
                {['Free to list', 'M-Pesa payments', 'Admin verified', 'Nationwide'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-400" />{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Stats card grid mockup */}
            <div className="hidden lg:flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Live</span>
                    </div>
                    <p className={`text-3xl font-black ${color}`}>{value}</p>
                    <p className="text-sm text-gray-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>
              {/* Mini listing preview mockup */}
              <div className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-7 w-7 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">Samsung Galaxy S24 Ultra</p>
                  <p className="text-gray-400 text-xs mt-0.5">Nairobi · Electronics</p>
                  <p className="text-orange-400 font-black text-base mt-1">KSh 89,000</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">New</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100 dark:divide-gray-800">
            {[
              { icon: Tag, title: 'Free to List', desc: 'No commission. No hidden fees.' },
              { icon: BadgeCheck, title: 'Verified Sellers', desc: 'Every listing reviewed before going live.' },
              { icon: Globe, title: 'Nationwide', desc: 'Buyers and sellers across Kenya.' },
              { icon: CreditCard, title: 'M-Pesa Payments', desc: 'Pay and receive securely.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-5">
                <div className="bg-orange-50 dark:bg-orange-950 p-2.5 rounded-xl flex-shrink-0">
                  <Icon className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-7xl flex-1 space-y-12">

        {/* ── CATEGORIES ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black dark:text-white">Shop by Category</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Find what you're looking for</p>
            </div>
            <Link href="/listings" className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1 group">
              View all <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {categories.map(({ name, icon: Icon, color, light, text, count }) => (
              <Link key={name} href={`/listings?category=${encodeURIComponent(name)}`}
                className={`group flex flex-col items-center gap-2.5 p-3 ${light} rounded-2xl border border-transparent hover:border-current hover:border-opacity-20 transition-all hover:-translate-y-1`}
                style={{ borderColor: 'transparent' }}>
                <div className={`${color} w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold ${text} leading-tight`}>{name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black dark:text-white">How it Works</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Start buying or selling in minutes</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map(({ step, icon: Icon, title, desc }, i) => (
              <div key={step} className="relative flex flex-col items-center text-center gap-3">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute left-[calc(50%+2.5rem)] top-6 w-[calc(100%-5rem)] h-px bg-orange-100 dark:bg-orange-900/40" />
                )}
                <div className="relative">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center z-10 relative">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center z-20" style={{fontSize: '9px'}}>{step}</span>
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BROWSE BY CITY ── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-2xl font-black dark:text-white">Browse by City</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Find listings near you</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {cities.map((city, i) => (
              <Link key={city} href={`/listings?location=${encodeURIComponent(city)}`}
                className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-3 text-center hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950 dark:hover:border-orange-700 transition-all hover:-translate-y-0.5">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs font-bold dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{city}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── SELL CTA ── */}
        <section className="relative bg-gray-900 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 10% 50%, #f97316 0%, transparent 50%),
                              radial-gradient(circle at 90% 50%, #ea580c 0%, transparent 50%)`
          }} />
          <div className="relative flex flex-col sm:flex-row items-center justify-between p-10 gap-6">
            <div className="text-white space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1">
                <Zap className="h-3 w-3" /> For Sellers
              </div>
              <h3 className="text-3xl lg:text-4xl font-black">Start Selling Today</h3>
              <p className="text-gray-300 max-w-sm text-sm leading-relaxed">
                List products for free. Reach thousands of buyers across Kenya. Get paid via M-Pesa instantly.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0 w-full sm:w-auto">
              <Link href="/register" className="bg-orange-500 hover:bg-orange-400 text-white font-black px-10 py-3.5 rounded-xl text-center transition-all hover:scale-105">
                Create Free Account
              </Link>
              <Link href="/login" className="border border-white/20 hover:bg-white/10 text-white px-10 py-3.5 rounded-xl text-center text-sm font-semibold transition-all">
                Already have an account?
              </Link>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black dark:text-white">What Kenyans Say</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Trusted by buyers and sellers nationwide</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-0.5">
                    {[...Array(t.stars)].map((_, i) => <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />)}
                  </div>
                  <span className="text-xs font-semibold bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">{t.role}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-black">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* WhatsApp sticky button */}
      <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl flex items-center gap-2 z-40 transition-all hover:scale-110 group">
        <MessageCircle className="h-6 w-6" />
        <span className="hidden group-hover:block text-sm font-semibold pr-1 whitespace-nowrap">WhatsApp Support</span>
      </a>

      <Footer />
    </div>
  )
}
