"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Search, ShoppingBag, User, Heart, Bell, ChevronRight, X, Home, Package, Star, Tag, HelpCircle, LogOut, Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from './theme-provider'
import { getUser, clearAuth } from '@/lib/auth'

const CATEGORIES = [
  { name: 'Electronics', icon: '📱', href: '/listings?category=Electronics' },
  { name: 'Fashion', icon: '👗', href: '/listings?category=Fashion' },
  { name: 'Home & Office', icon: '🏠', href: '/listings?category=Home+%26+Garden' },
  { name: 'Phones', icon: '☎️', href: '/listings?category=Electronics' },
  { name: 'Computing', icon: '💻', href: '/listings?category=Electronics' },
  { name: 'Supermarket', icon: '🛒', href: '/listings?category=Agriculture' },
  { name: 'Health', icon: '💊', href: '/listings?category=Health+%26+Beauty' },
  { name: 'Vehicles', icon: '🚗', href: '/listings?category=Vehicles' },
  { name: 'Property', icon: '🏢', href: '/listings?category=Property' },
  { name: 'Sports', icon: '⚽', href: '/listings?category=Sports' },
  { name: 'Baby', icon: '🧸', href: '/listings?category=Baby+%26+Kids' },
  { name: 'Services', icon: '💼', href: '/listings?category=Services' },
]

interface NavbarProps {
  onSearch?: (q: string) => void
}

export default function Navbar({ onSearch }: NavbarProps) {
  const { theme, toggle } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const router = useRouter()

  useEffect(() => { setUser(getUser()) }, [])

  const logout = () => { clearAuth(); setUser(null); router.push('/'); setDrawerOpen(false) }
  const dashLink = user ? (user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/buyer') : '/login'

  const doSearch = () => {
    const q = searchVal.trim()
    router.push(q ? `/listings?q=${encodeURIComponent(q)}` : '/listings')
    onSearch?.(q)
  }

  return (
    <>
      {/* Flash deals banner */}
      <div className="bg-orange-500 text-white text-center py-1.5 text-xs font-semibold tracking-wide">
        🔥 Free listings for all sellers &nbsp;|&nbsp; M-Pesa payments &nbsp;|&nbsp; 47 counties covered
      </div>

      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        {/* Main header row */}
        <div className="flex items-center gap-3 px-3 py-2.5 max-w-6xl mx-auto">
          {/* Hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1.5">
            <div className="bg-orange-500 text-white font-black text-sm px-2 py-1 rounded-lg leading-none">SK</div>
            <span className="font-black text-gray-900 dark:text-white text-base hidden sm:block">Sokoni<span className="text-orange-500">Kenya</span></span>
          </Link>

          {/* Search bar */}
          <div className="flex flex-1 min-w-0 mx-1">
            <input
              type="text"
              value={searchVal}
              onChange={e => { setSearchVal(e.target.value); onSearch?.(e.target.value) }}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Search products, brands..."
              className="flex-1 min-w-0 border-2 border-orange-400 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-orange-500 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <button onClick={doSearch} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-full flex-shrink-0 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link href={dashLink} className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors min-w-0">
              <User className="h-5 w-5" />
              <span className="text-xs mt-0.5 hidden sm:block whitespace-nowrap">{user ? (user.email?.split('@')[0].slice(0,8)) : 'Account'}</span>
            </Link>
            <button onClick={toggle} className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="text-xs mt-0.5 hidden sm:block">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>

        {/* Category strip */}
        <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto scrollbar-hide">
          <div className="flex items-center px-3 max-w-6xl mx-auto">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} href={cat.href}
                className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex-shrink-0 group">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs whitespace-nowrap group-hover:text-orange-500">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Side Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 w-72 max-w-[85vw] h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="bg-orange-500 px-4 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="font-black text-white text-lg">Sokoni Kenya</p>
                <p className="text-orange-100 text-xs">{user ? user.email : 'Welcome! Sign in to continue'}</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-white p-1 hover:bg-orange-600 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 divide-y divide-gray-100 dark:divide-gray-800">
              {/* Help */}
              <Link href="/support" onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3"><HelpCircle className="h-5 w-5 text-orange-500" /><span className="font-semibold text-sm dark:text-white">Need Help?</span></div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              {/* My Account section */}
              {user ? (
                <>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800"><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">MY ACCOUNT</p></div>
                  <Link href={dashLink} onClick={() => setDrawerOpen(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3"><User className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Dashboard</span></div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  {user.role === 'seller' && (
                    <Link href="/seller/listings/create" onClick={() => setDrawerOpen(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-3"><Package className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Post a Listing</span></div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  )}
                  {user.role === 'buyer' && (
                    <Link href="/buyer" onClick={() => setDrawerOpen(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-3"><Heart className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Saved Items</span></div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 w-full text-left">
                    <LogOut className="h-5 w-5 text-red-500" /><span className="text-sm text-red-500 font-semibold">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800"><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">MY ACCOUNT</p></div>
                  <Link href="/login" onClick={() => setDrawerOpen(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3"><User className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Login</span></div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link href="/register" onClick={() => setDrawerOpen(false)} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3"><Star className="h-5 w-5 text-orange-500" /><span className="text-sm dark:text-white">Create Account</span></div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </>
              )}

              {/* Dark mode toggle */}
              <button onClick={toggle} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 w-full">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Sun className="h-5 w-5 text-orange-500" /> : <Moon className="h-5 w-5 text-orange-500" />}
                  <span className="text-sm dark:text-white">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </button>

              {/* Categories */}
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">OUR CATEGORIES</p>
                <Link href="/listings" onClick={() => setDrawerOpen(false)} className="text-xs text-orange-500 font-semibold">See All</Link>
              </div>
              {CATEGORIES.map(cat => (
                <Link key={cat.name} href={cat.href} onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3"><span className="text-xl">{cat.icon}</span><span className="text-sm dark:text-white">{cat.name}</span></div>
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
