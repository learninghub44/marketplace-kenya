"use client"
import { useEffect, useState, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Grid, List, SlidersHorizontal, ChevronDown, X, ShoppingCart, Search, Filter } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProductCard from '@/components/ProductCard'
import { getUser, authHeaders } from '@/lib/auth'
import { useCart } from '@/store/cart'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

const CATEGORIES = ['All','Electronics','Fashion','Home & Garden','Vehicles','Agriculture','Sports','Baby & Kids','Property','Services','Health & Beauty']
const LOCATIONS  = ['All Locations','Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Meru','Nyeri','Kakamega','Garissa']
const CONDITIONS = [
  { value: '',             label: 'Any Condition' },
  { value: 'new',         label: 'Brand New' },
  { value: 'used',        label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' },
]
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'discount',   label: 'Biggest Discount' },
]
const PRICE_PRESETS = [
  { label: 'Under KES 1K',       min: '',     max: '1000' },
  { label: 'KES 1K – 5K',       min: '1000', max: '5000' },
  { label: 'KES 5K – 20K',      min: '5000', max: '20000' },
  { label: 'KES 20K – 100K',    min: '20000',max: '100000' },
  { label: 'Over KES 100K',      min: '100000', max: '' },
]

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-2 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mt-2" />
        <div className="h-7 bg-gray-100 rounded mt-2" />
      </div>
    </div>
  )
}

function ActiveBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:text-orange-900 transition-colors">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

function ListingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState(searchParams.get('q') || searchParams.get('search') || '')
  const [category, setCategory]   = useState(searchParams.get('category') || 'All')
  const [location, setLocation]   = useState(searchParams.get('location') || 'All Locations')
  const [condition, setCondition] = useState('')
  const [priceMin, setPriceMin]   = useState('')
  const [priceMax, setPriceMax]   = useState('')
  const [inStockOnly, setInStockOnly]   = useState(false)
  const [sort, setSort]           = useState('newest')
  const [view, setView]           = useState<'grid'|'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [page, setPage]           = useState(1)
  const [hasMore, setHasMore]     = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const user = getUser()
  const { addItem, count: cartCount } = useCart()
  const PER_PAGE = 24

  const buildParams = useCallback((pg: number) => {
    const params = new URLSearchParams({ status: 'active', limit: String(PER_PAGE), offset: String((pg - 1) * PER_PAGE) })
    if (search)                    params.set('search',    search)
    if (category !== 'All')        params.set('category',  category)
    if (location !== 'All Locations') params.set('location', location)
    if (condition)                 params.set('condition', condition)
    if (priceMin)                  params.set('price_min', priceMin)
    if (priceMax)                  params.set('price_max', priceMax)
    if (inStockOnly)               params.set('in_stock',  'true')
    if (sort)                      params.set('sort',      sort)
    return params
  }, [search, category, location, condition, priceMin, priceMax, inStockOnly, sort])

  const fetchListings = useCallback(async (pg: number, reset: boolean) => {
    setLoading(true)
    try {
      const res  = await fetch(`${API_BASE}/api/listings?${buildParams(pg)}`)
      const data = await res.json()
      if (data.success) {
        const items = data.listings || []
        setListings(prev => reset ? items : [...prev, ...items])
        setTotal(data.total || 0)
        setHasMore(data.page?.has_more ?? items.length === PER_PAGE)
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [buildParams])

  useEffect(() => { setPage(1); fetchListings(1, true) },
    [search, category, location, condition, priceMin, priceMax, inStockOnly, sort])
  useEffect(() => { if (page > 1) fetchListings(page, false) }, [page])

  const toggleFav = async (id: string) => {
    if (!user) { router.push('/login'); return }
    const next = new Set(favorites)
    if (next.has(id)) {
      next.delete(id)
      await fetch(`${API_BASE}/api/favorites/${id}`, { method: 'DELETE', headers: authHeaders() })
    } else {
      next.add(id)
      await fetch(`${API_BASE}/api/favorites`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ listing_id: id }) })
    }
    setFavorites(next)
  }

  const clearAll = () => {
    setCategory('All'); setLocation('All Locations'); setSearch('')
    setCondition(''); setPriceMin(''); setPriceMax(''); setInStockOnly(false)
  }

  const activeCount = [
    category !== 'All', location !== 'All Locations',
    !!condition, !!priceMin || !!priceMax, inStockOnly,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-4 flex-1 max-w-7xl">

        {/* ── Breadcrumb + heading ──────────────────────────── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{category === 'All' ? 'All Products' : category}</span>
          {total > 0 && <span className="text-gray-400 ml-auto text-xs">{total.toLocaleString()} results</span>}
        </div>

        {/* ── Page layout: sidebar + grid ──────────────────── */}
        <div className="flex gap-4">

          {/* ── SIDEBAR FILTERS (desktop) ─────────────────── */}
          <aside className={`w-56 flex-shrink-0 hidden lg:flex flex-col gap-3`}>

            {/* All categories */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <p className="px-4 py-3 font-black text-sm text-gray-900 border-b border-gray-100 bg-orange-500 text-white">
                All Categories
              </p>
              <div className="py-1">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 ${
                      category === c
                        ? 'bg-orange-50 text-orange-600 font-bold border-r-2 border-orange-500'
                        : 'text-gray-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <p className="font-bold text-sm text-gray-900 mb-2">Location</p>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full border border-gray-200 text-sm px-2.5 py-2 rounded-lg focus:outline-none focus:border-orange-400 text-gray-700"
              >
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            {/* Price range */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <p className="font-bold text-sm text-gray-900 mb-3">Price Range (KES)</p>
              <div className="space-y-1.5 mb-3">
                {PRICE_PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setPriceMin(p.min); setPriceMax(p.max) }}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition-colors ${
                      priceMin === p.min && priceMax === p.max
                        ? 'bg-orange-50 text-orange-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  placeholder="Min" className="w-1/2 border border-gray-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-orange-400" />
                <span className="text-gray-400 text-xs">–</span>
                <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  placeholder="Max" className="w-1/2 border border-gray-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-orange-400" />
              </div>
            </div>

            {/* Condition */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <p className="font-bold text-sm text-gray-900 mb-2">Condition</p>
              <div className="space-y-1.5">
                {CONDITIONS.map(c => (
                  <label key={c.value} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      value={c.value}
                      checked={condition === c.value}
                      onChange={() => setCondition(c.value)}
                      className="accent-orange-500"
                    />
                    <span className="text-sm text-gray-600">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Extra toggles */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <p className="font-bold text-sm text-gray-900 mb-3">More Filters</p>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                <span className="text-sm text-gray-600">In Stock Only</span>
              </label>
            </div>

            {/* Clear */}
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="w-full flex items-center justify-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-semibold py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear All Filters
              </button>
            )}
          </aside>

          {/* ── MAIN CONTENT ──────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Control bar */}
            <div className="bg-white rounded-lg border border-gray-100 px-3 py-2.5 mb-3 flex items-center gap-2 flex-wrap">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden flex items-center gap-1.5 text-sm font-semibold text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-3.5 w-3.5" />
                Filters
                {activeCount > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{activeCount}</span>
                )}
              </button>

              {/* Category pills — desktop hidden (using sidebar), mobile shown */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide lg:hidden min-w-0 flex-1">
                {CATEGORIES.slice(0, 6).map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
                      category === c
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Count */}
              <p className="text-xs text-gray-500 hidden lg:block">
                {loading && !listings.length ? 'Searching…' : `${total.toLocaleString()} product${total !== 1 ? 's' : ''}`}
              </p>

              <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                {/* Sort */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 hidden sm:block font-medium">Sort:</span>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="text-xs border border-gray-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-orange-400 text-gray-700 bg-white"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {/* Grid/List toggle */}
                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-1.5 ${view === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'} transition-colors`}
                    title="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-1.5 border-l border-gray-200 ${view === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'} transition-colors`}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                {/* Quick access to add listing */}
                {user?.role === 'seller' && (
                  <Link href="/seller/listings/create"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap">
                    + Add Listing
                  </Link>
                )}
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {category !== 'All' && <ActiveBadge label={`Category: ${category}`} onRemove={() => setCategory('All')} />}
                {location !== 'All Locations' && <ActiveBadge label={`📍 ${location}`} onRemove={() => setLocation('All Locations')} />}
                {condition && <ActiveBadge label={CONDITIONS.find(c => c.value === condition)?.label ?? condition} onRemove={() => setCondition('')} />}
                {(priceMin || priceMax) && (
                  <ActiveBadge
                    label={`KES ${priceMin || '0'} – ${priceMax || '∞'}`}
                    onRemove={() => { setPriceMin(''); setPriceMax('') }}
                  />
                )}
                {inStockOnly && <ActiveBadge label="In Stock Only" onRemove={() => setInStockOnly(false)} />}
              </div>
            )}

            {/* ── Product grid ──────────────────────────── */}
            {loading && !listings.length ? (
              <div className={view === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3'
                : 'flex flex-col gap-3'
              }>
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 text-center py-20 px-6">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  We couldn&apos;t find anything matching your search. Try a different keyword, category, or remove some filters.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={view === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3'
                  : 'flex flex-col gap-3'
                }>
                  {listings.map(l => (
                    <ProductCard
                      key={l.id}
                      listing={l}
                      onFavorite={toggleFav}
                      isFavorited={favorites.has(l.id)}
                    />
                  ))}
                  {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
                </div>

                {hasMore && !loading && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setPage(p => p + 1)}
                      className="bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-600 font-bold px-8 py-3 rounded-lg shadow-sm transition-all text-sm"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ───────────────────────── */}
      {showSidebar && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSidebar(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-orange-500">
              <span className="font-black text-white">Filter Products</span>
              <button onClick={() => setShowSidebar(false)}>
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-5">
              {/* Category */}
              <div>
                <p className="font-bold text-sm text-gray-900 mb-2">Category</p>
                <div className="space-y-0.5">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => { setCategory(c); setShowSidebar(false) }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        category === c ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <p className="font-bold text-sm text-gray-900 mb-2">Price Range</p>
                {PRICE_PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setPriceMin(p.min); setPriceMax(p.max) }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      priceMin === p.min && priceMax === p.max
                        ? 'bg-orange-50 text-orange-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {/* Condition */}
              <div>
                <p className="font-bold text-sm text-gray-900 mb-2">Condition</p>
                {CONDITIONS.map(c => (
                  <label key={c.value} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input type="radio" name="m-condition" value={c.value} checked={condition === c.value}
                      onChange={() => setCondition(c.value)} className="accent-orange-500" />
                    <span className="text-sm text-gray-700">{c.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { clearAll(); setShowSidebar(false) }}
                  className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="flex-1 bg-orange-500 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm text-gray-500">Loading products…</p>
        </div>
      </div>
    }>
      <ListingsContent />
    </Suspense>
  )
}
