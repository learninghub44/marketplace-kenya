"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Moon, Sun, Menu, X, LogOut, User, ShoppingCart } from 'lucide-react'
import { useTheme } from './theme-provider'
import { getUser, clearAuth } from '@/lib/auth'
import { useCart } from '@/store/cart'
import CartDrawer from './CartDrawer'

interface NavbarProps {
  onSearch?: (q: string) => void
  showSearch?: boolean
}

const CATS = ['📱 Electronics','👗 Fashion','🏡 Home & Garden','🚗 Vehicles','🌾 Agriculture','⚽ Sports','🧸 Baby & Kids','🏢 Property','💼 Services','💄 Health & Beauty']

export default function Navbar({ onSearch, showSearch = false }: NavbarProps) {
  const { theme, toggle } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const router = useRouter()
  const { count: cartCount } = useCart()

  useEffect(() => { setUser(getUser()) }, [])

  const logout = () => { clearAuth(); setUser(null); router.push('/') }
  const dashLink = user ? (user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/buyer') : '/login'

  const doSearch = () => {
    if (searchVal.trim()) router.push(`/listings?q=${encodeURIComponent(searchVal)}`)
    else router.push('/listings')
  }

  return (
    <>
      <nav className="bg-gray-900 dark:bg-gray-950 sticky top-0 z-50 shadow-lg w-full">
        {/* Main bar */}
        <div className="w-full px-3 sm:px-4 py-2.5">
          <div className="flex items-center gap-2 w-full">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
              <div className="bg-orange-400 p-1.5 rounded-lg flex-shrink-0">
                <ShoppingBag className="h-4 w-4 text-gray-900" />
              </div>
              <span className="font-black text-white text-sm hidden xs:block sm:block whitespace-nowrap">
                Sokoni<span className="text-orange-400"> Kenya</span>
              </span>
            </Link>

            {/* Search */}
            <div className="flex flex-1 min-w-0 mx-1">
              <input
                value={searchVal}
                onChange={e => { setSearchVal(e.target.value); onSearch?.(e.target.value) }}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
                placeholder="Search products in Kenya..."
                className="flex-1 min-w-0 px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={doSearch}
                className="bg-orange-400 hover:bg-orange-500 px-3 py-2 rounded-r-lg flex-shrink-0 transition-colors"
              >
                <Search className="h-4 w-4 text-gray-900" />
              </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Dark mode — desktop */}
              <button
                onClick={toggle}
                className="hidden sm:flex p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Cart button — buyers */}
              {(!user || user.role === 'buyer') && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Open cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-orange-400 text-gray-900 text-[10px] font-black min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 leading-none">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Desktop nav links */}
              <div className="hidden sm:flex items-center gap-1">
                {user ? (
                  <>
                    <Link href={dashLink} className="text-xs text-gray-300 hover:text-white px-2 py-1.5 hover:bg-gray-800 rounded-lg transition-colors whitespace-nowrap">
                      {user.name?.split(' ')[0] || 'Dashboard'}
                    </Link>
                    <button onClick={logout} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors" title="Logout">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-xs text-gray-300 hover:text-white px-2 py-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                      Login
                    </Link>
                    <Link href="/register" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Category strip */}
        <div className="bg-gray-800 dark:bg-gray-900 border-t border-gray-700 overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 px-2 py-1 w-max min-w-full">
            {CATS.map(c => {
              const name = c.split(' ').slice(1).join(' ')
              return (
                <Link
                  key={c}
                  href={`/listings?category=${encodeURIComponent(name)}`}
                  className="whitespace-nowrap text-xs px-2.5 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                >
                  {c}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden bg-gray-900 dark:bg-gray-950 border-t border-gray-800 px-3 py-3 space-y-1">
            <button onClick={toggle} className="flex items-center gap-2 w-full text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link href="/listings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm">
              Browse Listings
            </Link>
            {(!user || user.role === 'buyer') && (
              <button
                onClick={() => { setMenuOpen(false); setCartOpen(true) }}
                className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm w-full"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart {cartCount > 0 ? `(${cartCount})` : ''}
              </button>
            )}
            <Link href="/support" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm">
              Support
            </Link>
            {user ? (
              <>
                <Link href={dashLink} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-orange-400 px-3 py-2 rounded-lg hover:bg-gray-800 text-sm">
                  <User className="h-4 w-4" /> My Dashboard
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="flex items-center gap-2 text-red-400 px-3 py-2 rounded-lg hover:bg-gray-800 w-full text-sm">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block bg-orange-400 text-gray-900 font-bold px-3 py-2 rounded-lg text-center text-sm">
                  Create Free Account
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
