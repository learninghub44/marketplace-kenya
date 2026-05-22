"use client"
import { useEffect, useState, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Grid, List, SlidersHorizontal, ChevronDown, X, ShoppingCart } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProductCard from '@/components/ProductCard'
import { getUser, authHeaders } from '@/lib/auth'
import { useCart } from '@/store/cart'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya-1.onrender.com'

const CATEGORIES = ['All','Electronics','Fashion','Home & Garden','Vehicles','Agriculture','Sports','Baby & Kids','Property','Services','Health & Beauty']
const LOCATIONS = ['All Locations','Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Meru','Nyeri','Kakamega','Garissa']
const CONDITIONS = [
  { value: '', label: 'Any Condition' },
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' },
]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'popular', label: 'Most Viewed' },
  { value: 'discount', label: 'Biggest Discount' },
]

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
      <div className="p-3 space-y-2">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2" />
      </div>
    </div>
  )
}

function ActiveFilterBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-semibold px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:text-orange-900 dark:hover:text-orange-100">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

function ListingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [location, setLocation] = useState(searchParams.get('location') || 'All Locations')
  const [condition, setCondition] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [deliveryOnly, setDeliveryOnly] = useState(false)
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState<'grid'|'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const user = getUser()
  const { addItem, count: cartCount } = useCart()
  const PER_PAGE = 24

  const buildParams = useCallback((pg: number) => {
    const params = new URLSearchParams({
      status: 'active',
      limit: String(PER_PAGE),
      offset: String((pg - 1) * PER_PAGE),
    })
    if (search) params.set('search', search)
    if (category !== 'All') params.set('category', category)
    if (location !== 'All Locations') params.set('location', location)
    if (condition) params.set('condition', condition)
    if (priceMin) params.set('price_min', priceMin)
    if (priceMax) params.set('price_max', priceMax)
    if (inStockOnly) params.set('in_stock', 'true')
    if (sort) params.set('sort', sort)
    return params
  }, [search, category, location, condition, priceMin, priceMax, inStockOnly, sort])

  const fetchListings = useCallback(async (pg: number, reset: boolean) => {
    setLoading(true)
    try {
      const params = buildParams(pg)
      const res = await fetch(`${API_BASE}/api/listings?${params}`)
      const data = await res.json()
      if (data.success) {
        const items = data.listings || []
        setListings(prev => reset ? items : [...prev, ...items])
        setTotal(data.total || 0)
        setHasMore(data.page?.has_more ?? items.length === PER_PAGE)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [buildParams])

  useEffect(() => {
    setPage(1)
    fetchListings(1, true)
  }, [search, category, location, condition, priceMin, priceMax, inStockOnly, sort])

  useEffect(() => { if (page > 1) fetchListings(page, false) }, [page])

  const toggleFav = async (id: string) => {
    if (!user) { router.push('/login'); return }
    const newFavs = new Set(favorites)
    if (newFavs.has(id)) {
      newFavs.delete(id)
      await fetch(`${API_BASE}/api/favorites/${id}`, { method: 'DELETE', headers: authHeaders() })
    } else {
      newFavs.add(id)
      await fetch(`${API_BASE}/api/favorites`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ listing_id: id }) })
    }
    setFavorites(newFavs)
  }

  const handleAddToCart = (listing: any, e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { router.push('/login'); return }
    addItem({
      listing_id: listing.id,
      title: listing.title,
      price: listing.discount_percent > 0 ? listing.price * (1 - listing.discount_percent / 100) : listing.price,
      quantity: 1,
      image: listing.listing_images?.[0]?.url || listing.images?.[0] || undefined,
      seller_id: listing.seller_id,
    })
  }

  const clearAll = () => {
    setCategory('All')
    setLocation('All Locations')
    setSearch('')
    setCondition('')
    setPriceMin('')
    setPriceMax('')
    setInStockOnly(false)
    setDeliveryOnly(false)
  }

  const activeFilterCount = [
    category !== 'All',
    location !== 'All Locations',
    !!condition,
    !!priceMin || !!priceMax,
    inStockOnly,
    deliveryOnly,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar showSearch onSearch={q => setSearch(q)} />

      <div className="container mx-auto px-3 sm:px-4 py-4 flex-1 max-w-7xl">

        {/* Top control bar */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-orange-400 text-gray-900'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto flex-1 scrollbar-hide min-w-0">
            {CATEGORIES.slice(0, 7).map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
                  category === c
                    ? 'bg-orange-400 text-gray-900'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort + view toggles */}
          <div className="flex items-center gap-2 ml-auto">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs px-2 py-2 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-orange-400 text-gray-900' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500'}`}>
              <Grid className="h-4 w-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-orange-400 text-gray-900' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced filter panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm px-2.5 py-2 rounded-lg focus:outline-none dark:text-white">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Location</label>
                <select value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm px-2.5 py-2 rounded-lg focus:outline-none dark:text-white">
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Condition</label>
                <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm px-2.5 py-2 rounded-lg focus:outline-none dark:text-white">
                  {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Min Price (KES)</label>
                <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="0" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm px-2.5 py-2 rounded-lg focus:outline-none dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Max Price (KES)</label>
                <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Any" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm px-2.5 py-2 rounded-lg focus:outline-none dark:text-white" />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="accent-orange-400 w-4 h-4" />
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">In Stock Only</span>
              </label>
              <button onClick={clearAll} className="text-sm text-orange-500 hover:text-orange-600 font-semibold ml-auto">
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Active filter badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {category !== 'All' && <ActiveFilterBadge label={category} onRemove={() => setCategory('All')} />}
            {location !== 'All Locations' && <ActiveFilterBadge label={location} onRemove={() => setLocation('All Locations')} />}
            {condition && <ActiveFilterBadge label={condition} onRemove={() => setCondition('')} />}
            {(priceMin || priceMax) && (
              <ActiveFilterBadge
                label={`KES ${priceMin || '0'} – ${priceMax || '∞'}`}
                onRemove={() => { setPriceMin(''); setPriceMax('') }}
              />
            )}
            {inStockOnly && <ActiveFilterBadge label="In Stock" onRemove={() => setInStockOnly(false)} />}
          </div>
        )}

        {/* Result count + add listing */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {loading && listings.length === 0
              ? 'Searching...'
              : `${total.toLocaleString()} listing${total !== 1 ? 's' : ''}${category !== 'All' ? ` in ${category}` : ''}`
            }
          </p>
          <div className="flex items-center gap-2">
            {user?.role === 'buyer' && cartCount > 0 && (
              <Link href="/checkout" className="flex items-center gap-1.5 bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-3 py-2 rounded-lg text-sm transition-colors">
                <ShoppingCart className="h-4 w-4" />
                Cart ({cartCount})
              </Link>
            )}
            {user?.role === 'seller' && (
              <Link href="/seller/listings/create" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                + Add Listing
              </Link>
            )}
          </div>
        </div>

        {/* Grid / List */}
        {loading && listings.length === 0 ? (
          <div className={view === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'
            : 'flex flex-col gap-3'
          }>
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold dark:text-white">No listings found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Try a different search term, category, or adjust your filters
            </p>
            <button
              onClick={clearAll}
              className="mt-4 bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-2.5 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className={view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3'
              : 'flex flex-col gap-3'
            }>
              {listings.map(l => (
                <div key={l.id} className={view === 'list' ? 'max-w-2xl' : ''}>
                  <ProductCard
                    listing={l}
                    onFavorite={toggleFav}
                    isFavorited={favorites.has(l.id)}
                  />
                </div>
              ))}
              {/* Loading skeletons at the bottom during pagination */}
              {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
            </div>

            {hasMore && !loading && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-8 py-3 rounded-xl shadow-sm transition-colors"
                >
                  Load More Listings
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    }>
      <ListingsContent />
    </Suspense>
  )
}
