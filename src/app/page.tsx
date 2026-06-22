import Link from 'next/link'
import { ArrowRight, Tag, Shield, Truck, TrendingUp, Star, MessageCircle } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const categories = [
  { name: 'Electronics', emoji: '', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80', count: '2,400+' },
  { name: 'Fashion', emoji: '', image: 'https://images.unsplash.com/photo-1558171813-c57e21d86b46?w=400&q=80', count: '5,100+' },
  { name: 'Home & Garden', emoji: '', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', count: '1,800+' },
  { name: 'Vehicles', emoji: '', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80', count: '900+' },
  { name: 'Property', emoji: '', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80', count: '650+' },
  { name: 'Agriculture', emoji: '', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80', count: '1,200+' },
  { name: 'Sports', emoji: '', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', count: '430+' },
  { name: 'Services', emoji: '', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80', count: '320+' },
]

const benefits = [
  { icon: Tag, title: 'Free to List', desc: 'Post unlimited products — zero commission, zero hidden fees.' },
  { icon: Shield, title: 'Verified Sellers', desc: 'Every listing reviewed by our admin before going live.' },
  { icon: Truck, title: 'All 47 Counties', desc: 'Connect with buyers and sellers across all of Kenya.' },
  { icon: TrendingUp, title: 'M-Pesa Payments', desc: 'Pay and receive securely via M-Pesa.' },
]

const cities = [
  { city: 'Nairobi', image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&q=80' },
  { city: 'Mombasa', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&q=80' },
  { city: 'Kisumu', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80' },
  { city: 'Nakuru', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&q=80' },
  { city: 'Eldoret', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&q=80' },
  { city: 'All Kenya', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=300&q=80' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar showSearch />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80')",backgroundSize:'cover',backgroundPosition:'center'}} />
        <div className="relative container mx-auto px-4 py-14 lg:py-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="text-white space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-orange-400/20 border border-orange-400/40 rounded-full px-4 py-1.5 text-orange-300 text-sm font-medium">
               Kenya&apos;s Trusted Local Marketplace
            </div>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight">
              Buy &amp; Sell on<br /><span className="text-orange-400">Sokoni Kenya</span>
            </h1>
            <p className="text-gray-300 text-lg">Join 50,000+ Kenyans trading electronics, fashion, property, vehicles and more — safely and for free.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/listings" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                Browse Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/register" className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                Start Selling Free
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300 pt-1">
              <span> Free listings</span><span> M-Pesa</span><span> 47 counties</span><span> Admin verified</span>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3 w-72 flex-shrink-0">
            {[{label:'50K+',sub:'Active Users'},{label:'120K+',sub:'Products Listed'},{label:'47',sub:'Counties'},{label:'Free',sub:'Forever'}].map(s=>(
              <div key={s.label} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 text-white text-center">
                <p className="text-2xl font-black text-orange-400">{s.label}</p>
                <p className="text-xs text-gray-300 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100 dark:divide-gray-700">
            {benefits.map(({icon:Icon,title,desc})=>(
              <div key={title} className="flex items-start gap-3 p-4">
                <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded-lg flex-shrink-0"><Icon className="h-5 w-5 text-orange-500" /></div>
                <div><p className="font-semibold text-sm dark:text-white">{title}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1 space-y-10">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black dark:text-white">Shop by Category</h2>
            <Link href="/listings" className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map(cat=>(
              <Link key={cat.name} href={`/listings?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="relative h-20 overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-2 left-2 text-lg">{cat.emoji}</span>
                </div>
                <div className="p-2">
                  <p className="text-xs font-bold dark:text-white leading-tight">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sell CTA */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between p-8 gap-6">
            <div className="text-white space-y-2">
              <p className="text-orange-400 font-semibold text-sm uppercase tracking-wide">For Sellers</p>
              <h3 className="text-2xl lg:text-3xl font-black">Start Selling Today</h3>
              <p className="text-gray-300 max-w-sm text-sm">List products for free. Reach thousands of buyers across Kenya. Get paid via M-Pesa instantly.</p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/register" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-black px-8 py-3 rounded-xl text-center transition-colors">Create Free Account</Link>
              <Link href="/login" className="border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-xl text-center text-sm font-semibold transition-colors">Already have an account? Login</Link>
            </div>
          </div>
        </section>

        {/* Cities */}
        <section>
          <h2 className="text-xl font-black dark:text-white mb-4">Browse by City</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {cities.map(({city,image})=>(
              <Link key={city} href={`/listings?location=${encodeURIComponent(city)}`}
                className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <img src={image} alt={city} className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-bold">{city}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Testimonial strip */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-black dark:text-white mb-4 text-center">What Kenyans Say</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {name:'Mary W., Nairobi', text:'Sold my old laptop in 2 days! The process was simple and the buyer paid via M-Pesa instantly.', stars:5},
              {name:'James K., Mombasa', text:'Found exactly what I was looking for at a great price. Contacting the seller via WhatsApp was easy.', stars:5},
              {name:'Aisha M., Kisumu', text:'As a small business owner, listing my products here has brought me new customers every week.', stars:5},
            ].map(t=>(
              <div key={t.name} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2">
                <div className="flex gap-0.5">{[...Array(t.stars)].map((_,i)=><Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{t.text}"</p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-400">{t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WhatsApp sticky CTA */}
        <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2 z-40 transition-colors group">
          <MessageCircle className="h-6 w-6" />
          <span className="hidden group-hover:block text-sm font-semibold pr-1">WhatsApp Support</span>
        </a>
      </div>

      <Footer />
    </div>
  )
}
