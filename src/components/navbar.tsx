"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Moon, Sun, Menu, X, ShoppingBag, MapPin, LogOut, LayoutDashboard } from 'lucide-react'
import { useTheme } from './theme-provider'
import { getUser, clearAuth } from '@/lib/auth'

const CATS = [
  { label: 'Electronics', name: 'Electronics' },
  { label: 'Fashion', name: 'Fashion' },
  { label: 'Home & Garden', name: 'Home & Garden' },
  { label: 'Vehicles', name: 'Vehicles' },
  { label: 'Agriculture', name: 'Agriculture' },
  { label: 'Sports', name: 'Sports' },
  { label: 'Baby & Kids', name: 'Baby & Kids' },
  { label: 'Property', name: 'Property' },
  { label: 'Services', name: 'Services' },
  { label: 'Health & Beauty', name: 'Health & Beauty' },
]

interface NavbarProps { onSearch?: (q: string) => void; showSearch?: boolean }

export default function Navbar({ onSearch }: NavbarProps) {
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => { setUser(getUser()) }, [])

  const dashLink = user
    ? (user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/buyer')
    : '/login'

  const doSearch = () => {
    const q = searchVal.trim()
    if (onSearch) onSearch(q)
    else router.push(q ? `/listings?q=${encodeURIComponent(q)}` : '/listings')
  }

  const logout = () => { clearAuth(); setUser(null); router.push('/login') }

  return (
    <>
      <div className="bg-gray-900 text-xs hidden sm:block">
        <div className="container mx-auto px-4 max-w-7xl flex justify-between py-1.5 text-gray-400">
          <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Nationwide delivery across Kenya</div>
          <div className="flex gap-4">
            <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400">WhatsApp Support</a>
            <Link href="/support" className="hover:text-orange-400">Help Centre</Link>
          </div>
        </div>
      </div>

      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3 h-14">
            <Link href="/" className="flex-shrink-0 flex items-center gap-1.5">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="font-black text-gray-900 dark:text-white text-lg hidden sm:block">Sokoni<span className="text-orange-500">Kenya</span></span>
            </Link>

            <div className="flex-1 flex gap-1.5 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  placeholder="Search products, brands…"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <button onClick={doSearch} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0">Search</button>
            </div>

            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              <button onClick={toggle} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              {user ? (
                <>
                  <Link href={dashLink} className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-orange-500 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-50">
                    <LayoutDashboard className="h-3.5 w-3.5" />Dashboard
                  </Link>
                  <button onClick={logout} className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <LogOut className="h-3.5 w-3.5" />Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 px-3 py-1.5">Sign In</Link>
                  <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl hidden sm:block">Register</Link>
                </>
              )}
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 sm:hidden">
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl overflow-x-auto scrollbar-hide">
            <div className="flex w-max">
              {CATS.map(c => (
                <Link key={c.name} href={`/listings?category=${encodeURIComponent(c.name)}`}
                  className="flex-shrink-0 px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 whitespace-nowrap">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
            {user ? (
              <>
                <Link href={dashLink} onClick={() => setMenuOpen(false)} className="block py-2 font-semibold text-orange-500">Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="block py-2 text-sm text-gray-500 w-full text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block py-2 font-semibold text-gray-700 dark:text-gray-300">Sign In</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block py-2 font-semibold text-orange-500">Register Free</Link>
              </>
            )}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 space-y-1">
              {CATS.map(c => (
                <Link key={c.name} href={`/listings?category=${encodeURIComponent(c.name)}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500">{c.label}</Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
