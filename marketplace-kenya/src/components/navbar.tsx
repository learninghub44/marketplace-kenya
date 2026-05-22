"use client"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Moon, Sun, Menu, X, LogOut, User, ShoppingCart, ChevronDown, MapPin } from 'lucide-react'
import { useTheme } from './theme-provider'
import { getUser, clearAuth } from '@/lib/auth'
import { useCart } from '@/store/cart'
import CartDrawer from './CartDrawer'

interface NavbarProps {
  onSearch?: (q: string) => void
  showSearch?: boolean
}

const CATS = [
  { label: '📱 Electronics',    name: 'Electronics' },
  { label: '👗 Fashion',        name: 'Fashion' },
  { label: '🏡 Home & Garden',  name: 'Home & Garden' },
  { label: '🚗 Vehicles',       name: 'Vehicles' },
  { label: '🌾 Agriculture',    name: 'Agriculture' },
  { label: '⚽ Sports',         name: 'Sports' },
  { label: '🍼 Baby & Kids',    name: 'Baby & Kids' },
  { label: '🏢 Property',       name: 'Property' },
  { label: '💼 Services',       name: 'Services' },
  { label: '💄 Health & Beauty',name: 'Health & Beauty' },
]

export default function Navbar({ onSearch, showSearch = false }: NavbarProps) {
  const { theme, toggle } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const router = useRouter()
  const { count: cartCount } = useCart()

  useEffect(() => { setUser(getUser()) }, [])

  const logout = () => { clearAuth(); setUser(null); router.push('/') }
  const dashLink = user ? (user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/buyer') : '/login'

  const doSearch = () => {
    const q = searchVal.trim()
    if (onSearch) onSearch(q)
    else router.push(q ? `/listings?q=${encodeURIComponent(q)}` : '/listings')
  }

  return (
    <>
      {/* ── Top utility bar ───────────────────────────────────────── */}
      <div className="bg-gray-900 text-gray-300 text-xs hidden sm:block">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between py-1.5">
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin className="h-3 w-3" />
            <span>Delivering to all 47 counties in Kenya</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
              WhatsApp Support
            </a>
            <Link href="/support" className="hover:text-orange-400 transition-colors">Help Center</Link>
            <button onClick={toggle} className="flex items-center gap-1 hover:text-orange-400 transition-colors">
              {theme === 'dark' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main nav ──────────────────────────────────────────────── */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl py-3">
          <div className="flex items-center gap-3">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-orange-500 w-9 h-9 rounded-lg flex items-center justify-center shadow-sm">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="font-black text-gray-900 text-lg leading-none">Sokoni</p>
                <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest leading-none">Kenya</p>
              </div>
            </Link>

            {/* Category dropdown */}
            <div className="relative hidden lg:block flex-shrink-0">
              <button
                onClick={() => setCatOpen(o => !o)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors"
              >
                <Menu className="h-4 w-4" />
                All Categories
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {CATS.map(c => (
                    <Link key={c.name} href={`/listings?category=${encodeURIComponent(c.name)}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex flex-1 min-w-0">
              <input
                value={searchVal}
                onChange={e => { setSearchVal(e.target.value); if (onSearch) onSearch(e.target.value) }}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
                placeholder="Search products, brands and categories..."
                className="flex-1 min-w-0 border border-gray-300 border-r-0 rounded-l-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />
              <button
                onClick={doSearch}
                className="bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-r-lg transition-colors flex-shrink-0"
              >
                <Search className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 flex-shrink-0">

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors group"
                aria-label="Open cart"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-black min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 leading-none">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold hidden sm:block">Cart</span>
              </button>

              {/* Account — desktop */}
              <div className="hidden sm:flex">
                {user ? (
                  <div className="flex items-center gap-1">
                    <Link
                      href={dashLink}
                      className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-[10px] font-semibold truncate max-w-[60px]">
                        {user.name?.split(' ')[0] || 'Account'}
                      </span>
                    </Link>
                    <button
                      onClick={logout}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 ml-1">
                    <Link href="/login"
                      className="text-sm font-semibold text-gray-700 hover:text-orange-500 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap">
                      Sign In
                    </Link>
                    <Link href="/register"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap shadow-sm">
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Category strip ────────────────────────────────────── */}
        <div className="bg-orange-500 hidden sm:block">
          <div className="container mx-auto px-4 max-w-7xl overflow-x-auto scrollbar-hide">
            <div className="flex gap-0 w-max min-w-full">
              {CATS.map(c => (
                <Link
                  key={c.name}
                  href={`/listings?category=${encodeURIComponent(c.name)}`}
                  className="whitespace-nowrap text-xs px-3 py-2 text-orange-100 hover:text-white hover:bg-orange-600 transition-colors flex-shrink-0 font-medium"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────────── */}
        {menuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 shadow-lg">
            {user ? (
              <>
                <Link href={dashLink} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-orange-500 font-bold px-3 py-2.5 rounded-lg hover:bg-orange-50 text-sm">
                  <User className="h-4 w-4" /> My Account
                </Link>
                <button onClick={() => { setMenuOpen(false); setCartOpen(true) }}
                  className="flex items-center gap-2 text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm w-full">
                  <ShoppingCart className="h-4 w-4" /> Cart {cartCount > 0 ? `(${cartCount})` : ''}
                </button>
                <button onClick={() => { logout(); setMenuOpen(false) }}
                  className="flex items-center gap-2 text-red-500 px-3 py-2.5 rounded-lg hover:bg-red-50 w-full text-sm">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}
                  className="block bg-orange-500 text-white font-bold px-3 py-2.5 rounded-lg text-sm text-center">
                  Create Free Account
                </Link>
              </>
            )}
            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-1">
              {CATS.slice(0, 8).map(c => (
                <Link key={c.name} href={`/listings?category=${encodeURIComponent(c.name)}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs text-gray-600 px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
