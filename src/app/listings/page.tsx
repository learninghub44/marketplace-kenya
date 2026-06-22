"use client"
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Tag, Loader2, Grid, List, SlidersHorizontal, ChevronDown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProductCard from '@/components/product-card'
import { getUser, authHeaders } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const CATEGORIES = ['All','Electronics','Fashion','Home & Garden','Vehicles','Agriculture','Sports','Baby & Kids','Property','Services','Health & Beauty']
const LOCATIONS = ['All Locations','Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Meru','Nyeri','Kakamega','Garissa']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

function ListingsContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [location, setLocation] = useState(searchParams.get('location') || 'All Locations')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState<'grid'|'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const user = getUser()
  const PER_PAGE = 24

  useEffect(() => { setPage(1); fetchListings(1, true) }, [search, category, location, sort])
  useEffect(() => { if (page > 1) fetchListings(page, false) }, [page])

  const fetchListings = async (pg: number, reset: boolean) => {
    setLoading(true)
    try {
      let q = search
      let cat = category
      let loc = location

      // If the buyer typed a free-text search and hasn't manually narrowed by category/location,
      // let AI parse the query for intent (e.g. "cheap phone in Kisumu" -> query + filters).
      if (search && category === 'All' && location === 'All Locations') {
        try {
          const aiRes = await fetch(`${API_BASE}/api/ai/smart-search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: search }),
          })
          const aiData = await aiRes.json()
          if (aiData.success) {
            q = aiData.data.refinedQuery || search
            if (aiData.data.filters?.category) cat = aiData.data.filters.category
            if (aiData.data.filters?.location) loc = aiData.data.filters.location
          }
        } catch (e) { /* AI search is a nice-to-have — fall back to plain search silently */ }
      }

      const params = new URLSearchParams({ status: 'active', limit: String(PER_PAGE), offset: String((pg-1)*PER_PAGE) })
      if (q) params.set('search', q)
      if (cat !== 'All') params.set('category', cat)
      if (loc !== 'All Locations') params.set('location', loc)
      if (sort) params.set('sort', sort)
      const res = await fetch(`${API_BASE}/api/listings?${params}`)
      const data = await res.json()
      if (data.success) {
        const items = data.listings || []
        setListings(prev => reset ? items : [...prev, ...items])
        setHasMore(items.length === PER_PAGE)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const toggleFav = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    const newFavs = new Set(favorites)
    if (newFavs.has(id)) { newFavs.delete(id); await fetch(`${API_BASE}/api/favorites/${id}`, { method:'DELETE', headers: authHeaders() }) }
    else { newFavs.add(id); await fetch(`${API_BASE}/api/favorites`, { method:'POST', headers: authHeaders(), body: JSON.stringify({ listing_id: id }) }) }
    setFavorites(newFavs)
  }

  const ListingCard = ({ listing }: { listing: any }) => (
    <ProductCard
      listing={listing}
      view={view}
      favorited={favorites.has(listing.id)}
      onToggleFavorite={toggleFav}
    />
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar showSearch onSearch={q => { setSearch(q) }} />

      <div className="container mx-auto px-4 py-5 flex-1 max-w-7xl">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="h-4 w-4" />Filters <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick category pills */}
          <div className="flex gap-1.5 overflow-x-auto flex-1 scrollbar-hide">
            {CATEGORIES.slice(0,6).map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${category===c ? 'bg-orange-400 text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <select value={sort} onChange={e => setSort(e.target.value)} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs px-2 py-2 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view==='grid'?'bg-orange-400 text-gray-900':'bg-white dark:bg-gray-800 text-gray-500'}`}><Grid className="h-4 w-4" /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view==='list'?'bg-orange-400 text-gray-900':'bg-white dark:bg-gray-800 text-gray-500'}`}><List className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</label>
              <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm px-3 py-2 rounded-lg focus:outline-none dark:text-white">
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Location</label>
              <select value={location} onChange={e=>setLocation(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm px-3 py-2 rounded-lg focus:outline-none dark:text-white">
                {LOCATIONS.map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 flex items-end">
              <button onClick={() => { setCategory('All'); setLocation('All Locations'); setSearch('') }}
                className="text-sm text-orange-500 hover:text-orange-600 font-semibold">Clear all filters</button>
            </div>
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {loading && listings.length === 0 ? 'Loading...' : `${listings.length}${hasMore ? '+' : ''} listings ${category !== 'All' ? `in ${category}` : ''}`}
          </p>
          {user?.role === 'seller' && (
            <Link href="/seller/listings/create" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm">+ Add Listing</Link>
          )}
        </div>

        {loading && listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-orange-400" />
            <p className="text-gray-400 text-sm">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-950 flex items-center justify-center mx-auto mb-4">
              <Tag className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold dark:text-white">No listings found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Try a different search term, category, or location</p>
            <button onClick={() => { setSearch(''); setCategory('All'); setLocation('All Locations') }}
              className="mt-4 bg-orange-400 text-gray-900 font-bold px-6 py-2.5 rounded-lg">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className={view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3'
              : 'flex flex-col gap-3'}>
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <button onClick={() => setPage(p => p + 1)} disabled={loading}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-8 py-3 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Loading...</> : 'Load More Listings'}
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
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-400" /></div>}><ListingsContent /></Suspense>
}
