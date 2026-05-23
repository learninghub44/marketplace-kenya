"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Moon, Sun, Menu, X, LogOut, User, ShoppingCart, ChevronRight, HelpCircle, Package, Heart, Star, Home } from 'lucide-react'
import { useTheme } from './theme-provider'
import { getUser, clearAuth } from '@/lib/auth'

const CATS = [
  { name: 'Electronics', icon: '📱', q: 'Electronics' },
  { name: 'Fashion', icon: '👗', q: 'Fashion' },
  { name: 'Home & Office', icon: '🏠', q: 'Home & Garden' },
  { name: 'Phones', icon: '☎️', q: 'Electronics' },
  { name: 'Computing', icon: '💻', q: 'Electronics' },
  { name: 'Supermarket', icon: '🛒', q: 'Agriculture' },
  { name: 'Health', icon: '💊', q: 'Health & Beauty' },
  { name: 'Vehicles', icon: '🚗', q: 'Vehicles' },
  { name: 'Property', icon: '🏢', q: 'Property' },
  { name: 'Sports', icon: '⚽', q: 'Sports' },
  { name: 'Baby & Kids', icon: '🧸', q: 'Baby & Kids' },
  { name: 'Services', icon: '💼', q: 'Services' },
]

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [drawer, setDrawer] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => { setUser(getUser()) }, [])

  const logout = () => { clearAuth(); setUser(null); router.push('/'); setDrawer(false) }
  const dashLink = user ? (user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/buyer') : '/login'
  const doSearch = () => {
    const q = search.trim()
    router.push(q ? `/listings?q=${encodeURIComponent(q)}` : '/listings')
  }

  return (
    <>
      {/* Promo strip */}
      <div className="bg-orange-500 text-white text-center py-1.5 text-xs font-semibold">
        🔥 Free listings · M-Pesa payments · All 47 counties
      </div>

      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        {/* Main row */}
        <div className="flex items-center gap-2 px-3 py-2.5 max-w-6xl mx-auto">
          {/* Hamburger */}
          <button onClick={() => setDrawer(true)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex-shrink-0">
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1.5">
            <div className="bg-orange-500 text-white font-black text-xs px-2 py-1 rounded-lg">SK</div>
            <span className="font-black text-gray-900 dark:text-white text-sm hidden sm:block">Sokoni<span className="text-orange-500">Kenya</span></span>
          </Link>

          {/* Search */}
          <div className="flex flex-1 min-w-0 mx-1">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Search products, brands..."
              className="flex-1 min-w-0 border-2 border-orange-400 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <button onClick={doSearch} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-r-full flex-shrink-0">
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={toggle} className="p-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 rounded-lg">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link href={dashLink} className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500">
              <User className="h-5 w-5" />
              <span className="text-xs hidden sm:block">{user ? user.email?.split('@')[0].slice(0,8) : 'Account'}</span>
            </Link>
          </div>
        </div>

        {/* Category strip */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide">
          <div className="flex px-3 max-w-6xl mx-auto">
            {CATS.map(c => (
              <Link key={c.name} href={`/listings?category=${encodeURIComponent(c.q)}`}
                className="flex flex-col items-center gap-1 px-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 flex-shrink-0 group">
                <span className="text-base">{c.icon}</span>
                <span className="text-xs whitespace-nowrap group-hover:text-orange-500">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Side Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="relative bg-white dark:bg-gray-900 w-72 max-w-[85vw] h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="bg-orange-500 px-4 py-4 flex items-center justify-between">
              <div>
                <p className="font-black text-white text-base">Sokoni Kenya</p>
                <p className="text-orange-100 text-xs">{user ? user.email : 'Sign in to continue'}</p>
              </div>
              <button onClick={() => setDrawer(false)} className="text-white p-1 hover:bg-orange-600 rounded-lg"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex-1 divide-y divide-gray-100 dark:divide-gray-800">
              <Link href="/support" onClick={() => setDrawer(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-3"><HelpCircle className="h-5 w-5 text-orange-500" /><span className="font-semibold text-sm dark:text-white">Need Help?</span></div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800"><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">MY ACCOUNT</p></div>
              {user ? (
                <>
                  <Link href={dashLink} onClick={() => setDrawer(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3"><User className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Dashboard</span></div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  {user.role === 'seller' && (
                    <Link href="/seller/listings/create" onClick={() => setDrawer(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-3"><Package className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Post Listing</span></div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  )}
                  {user.role === 'buyer' && (
                    <Link href="/buyer/orders" onClick={() => setDrawer(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-3"><Package className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">My Orders</span></div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  )}
                  <Link href="/buyer" onClick={() => setDrawer(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3"><Heart className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Saved Items</span></div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <button onClick={logout} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 w-full">
                    <LogOut className="h-5 w-5 text-red-500" /><span className="text-sm text-red-500 font-semibold">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setDrawer(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3"><User className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Login</span></div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link href="/register" onClick={() => setDrawer(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3"><Star className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Create Account</span></div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </>
              )}

              <button onClick={toggle} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 w-full">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Sun className="h-5 w-5 text-orange-500" /> : <Moon className="h-5 w-5 text-orange-500" />}
                  <span className="text-sm dark:text-white">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </button>

              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">OUR CATEGORIES</p>
                <Link href="/listings" onClick={() => setDrawer(false)} className="text-xs text-orange-500 font-semibold">See All</Link>
              </div>
              {CATS.map(c => (
                <Link key={c.name} href={`/listings?category=${encodeURIComponent(c.q)}`} onClick={() => setDrawer(false)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3"><span className="text-xl">{c.icon}</span><span className="text-sm dark:text-white">{c.name}</span></div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
