"use client"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Moon, Sun, Menu, X, LogOut, User, MessageCircle } from 'lucide-react'
import { useTheme } from './theme-provider'
import { getUser, clearAuth } from '@/lib/auth'

interface NavbarProps {
  onSearch?: (q: string) => void
  showSearch?: boolean
}

export default function Navbar({ onSearch, showSearch = false }: NavbarProps) {
  const { theme, toggle } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => { setUser(getUser()) }, [])

  const logout = () => { clearAuth(); setUser(null); router.push('/') }

  const dashLink = user ? (user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/buyer') : '/login'

  return (
    <nav className="bg-gray-900 dark:bg-gray-950 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-orange-400 p-1.5 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-gray-900" />
            </div>
            <div className="leading-none">
              <span className="font-black text-white text-base tracking-tight">Sokoni</span>
              <span className="font-black text-orange-400 text-base tracking-tight"> Kenya</span>
            </div>
          </Link>

          {/* Search */}
          {showSearch && (
            <div className="flex-1 flex max-w-xl">
              <input value={searchVal}
                onChange={e => { setSearchVal(e.target.value); onSearch?.(e.target.value) }}
                onKeyDown={e => e.key === 'Enter' && router.push(`/listings?q=${searchVal}`)}
                placeholder="Search products, categories..."
                className="flex-1 px-4 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-800 rounded-l-lg focus:outline-none border-0" />
              <button onClick={() => router.push(`/listings?q=${searchVal}`)}
                className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-r-lg transition-colors">
                <Search className="h-4 w-4 text-gray-900" />
              </button>
            </div>
          )}
          {!showSearch && <div className="flex-1" />}

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/listings" className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${pathname === '/listings' ? 'text-orange-400' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>Browse</Link>
            <Link href="/support" className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${pathname === '/support' ? 'text-orange-400' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>Support</Link>
            <button onClick={toggle} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Toggle dark mode">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href={dashLink} className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white px-3 py-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                  <User className="h-4 w-4" />{user.name || user.email?.split('@')[0]}
                </Link>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"><LogOut className="h-4 w-4" /></button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-300 hover:text-white px-3 py-1.5 hover:bg-gray-800 rounded-lg transition-colors">Login</Link>
                <Link href="/register" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-4 py-1.5 rounded-lg text-sm transition-colors">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <button onClick={toggle} className="p-2 text-gray-400 hover:text-white">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-400 hover:text-white">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-800 space-y-1 pb-2">
            {!showSearch && (
              <div className="flex mb-3">
                <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search..." className="flex-1 px-3 py-2 text-sm text-gray-900 rounded-l-lg focus:outline-none" />
                <button onClick={() => { router.push(`/listings?q=${searchVal}`); setMenuOpen(false) }} className="bg-orange-400 px-3 py-2 rounded-r-lg"><Search className="h-4 w-4 text-gray-900" /></button>
              </div>
            )}
            <Link href="/listings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800">Browse Listings</Link>
            <Link href="/support" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800">Support Center</Link>
            {user ? (
              <>
                <Link href={dashLink} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-orange-400 px-3 py-2 rounded-lg hover:bg-gray-800"><User className="h-4 w-4" />My Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="flex items-center gap-2 text-red-400 px-3 py-2 rounded-lg hover:bg-gray-800 w-full"><LogOut className="h-4 w-4" />Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block bg-orange-400 text-gray-900 font-bold px-3 py-2 rounded-lg text-center">Create Free Account</Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Category strip */}
      <div className="bg-gray-800 dark:bg-gray-900 border-t border-gray-700 overflow-x-auto">
        <div className="container mx-auto px-4 flex gap-0.5 py-1">
          {['📱 Electronics','👗 Fashion','🏡 Home & Garden','🚗 Vehicles','🌾 Agriculture','⚽ Sports','🧸 Baby & Kids','🏢 Property','💼 Services'].map(c => {
            const name = c.split(' ').slice(1).join(' ')
            return (
              <Link key={c} href={`/listings?category=${encodeURIComponent(name)}`}
                className="whitespace-nowrap text-xs px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                {c}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
