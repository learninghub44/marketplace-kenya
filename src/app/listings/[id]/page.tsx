"use client"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Star, BadgeCheck, MessageCircle, Heart, Share2,
  ShoppingCart, Loader2, ChevronRight, Package, Truck, RotateCcw, Shield
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProductGallery from '@/components/ProductGallery'
import { getUser, authHeaders } from '@/lib/auth'
import { useCart } from '@/store/cart'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

const CONDITION_LABELS: Record<string, string> = { new: 'Brand New', used: 'Used', refurbished: 'Refurbished' }

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [relatedListings, setRelatedListings] = useState<any[]>([])
  const [favorited, setFavorited] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const user = getUser()
  const { addItem } = useCart()

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/listings/${id}`)
        const data = await res.json()
        if (data.success) {
          setListing(data.listing)
          // Fetch related listings
          const relRes = await fetch(`${API_BASE}/api/listings?status=active&category=${encodeURIComponent(data.listing.category)}&limit=6`)
          const relData = await relRes.json()
          if (relData.success) setRelatedListings((relData.listings || []).filter((l: any) => l.id !== id).slice(0, 5))
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  const handleFavorite = async () => {
    if (!user) { router.push('/login'); return }
    if (favorited) {
      await fetch(`${API_BASE}/api/favorites/${id}`, { method: 'DELETE', headers: authHeaders() })
    } else {
      await fetch(`${API_BASE}/api/favorites`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ listing_id: id }) })
    }
    setFavorited(f => !f)
  }

  const handleAddToCart = () => {
    if (!user) { router.push('/login'); return }
    if (!listing) return
    const price = listing.discount_percent > 0
      ? listing.price * (1 - listing.discount_percent / 100)
      : listing.price

    addItem({
      listing_id: listing.id,
      title: listing.title,
      price: selectedVariant ? price + (selectedVariant.price_modifier || 0) : price,
      quantity,
      image: listing.listing_images?.[0]?.url || listing.images?.[0] || undefined,
      variant: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
      variant_id: selectedVariant?.id,
      seller_id: listing.seller_id,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing?.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          <p className="text-sm text-gray-500">Loading product…</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-5xl">😕</div>
          <h2 className="text-2xl font-black text-gray-800">Product Not Found</h2>
          <p className="text-gray-400 text-sm">This listing may have been removed or is no longer available.</p>
          <Link href="/listings" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl">Browse Products</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const discountedPrice = listing.discount_percent > 0
    ? listing.price * (1 - listing.discount_percent / 100)
    : null

  const displayPrice = discountedPrice ?? listing.price
  const variantImages = listing.listing_images?.length > 0
    ? listing.listing_images.sort((a: any, b: any) => a.order_index - b.order_index)
    : listing.images?.map((url: string, i: number) => ({ url, is_primary: i === 0 })) || []

  const seller = listing.sellers

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 max-w-6xl">
          <nav className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/listings" className="hover:text-orange-500 transition-colors">Listings</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/listings?category=${encodeURIComponent(listing.category)}`} className="hover:text-orange-500 transition-colors">{listing.category}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[160px]">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl flex-1">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left: Gallery */}
          <div>
            <ProductGallery images={variantImages} title={listing.title} />
          </div>

          {/* Right: Product info */}
          <div className="space-y-4">
            {/* Category + status badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/listings?category=${encodeURIComponent(listing.category)}`}
                className="text-xs text-orange-500 font-semibold uppercase tracking-wide hover:text-orange-600">
                {listing.category}
              </Link>
              {listing.condition && listing.condition !== 'new' && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
                  {CONDITION_LABELS[listing.condition] || listing.condition}
                </span>
              )}
              {listing.condition === 'new' && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Brand New
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{listing.title}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                KES {displayPrice.toLocaleString()}
              </span>
              {discountedPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">KES {listing.price.toLocaleString()}</span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-full">
                    -{listing.discount_percent}% OFF
                  </span>
                </>
              )}
            </div>

            {listing.is_negotiable && (
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">💬 Price is negotiable</p>
            )}

            {/* Variants */}
            {listing.product_variants?.length > 0 && (
              <div className="space-y-3">
                {Array.from(new Set((listing.product_variants as any[]).map((v: any) => v.name))).map((varName: any) => (
                  <div key={varName}>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{varName}:</p>
                    <div className="flex flex-wrap gap-2">
                      {(listing.product_variants as any[])
                        .filter((v: any) => v.name === varName)
                        .map((v: any) => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariant(selectedVariant?.id === v.id ? null : v)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                              selectedVariant?.id === v.id
                                ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 text-gray-700 dark:text-gray-300'
                            } ${v.stock_quantity === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                            disabled={v.stock_quantity === 0}
                          >
                            {v.value}
                            {v.price_modifier !== 0 && (
                              <span className="text-xs ml-1 text-gray-400">
                                {v.price_modifier > 0 ? `+KES ${v.price_modifier}` : `-KES ${Math.abs(v.price_modifier)}`}
                              </span>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Qty:</p>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 font-bold">−</button>
                <span className="w-10 text-center font-semibold dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(listing.stock_quantity || 99, q + 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 font-bold">+</button>
              </div>
              {listing.stock_quantity > 0 && (
                <span className="text-xs text-gray-400">{listing.stock_quantity} available</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-black py-3.5 rounded-xl transition-all ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-orange-400 hover:bg-orange-500 text-gray-900'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleFavorite}
                className={`p-3.5 rounded-xl border-2 transition-all ${
                  favorited
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300 dark:hover:border-red-700'
                }`}
              >
                <Heart className={`h-5 w-5 ${favorited ? 'fill-red-500' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* WhatsApp contact */}
            <a
              href={`https://wa.me/${listing.sellers?.phone?.replace(/[^0-9]/g, '') || '254701059192'}?text=${encodeURIComponent(`Hi, I'm interested in your listing: "${listing.title}" — KES ${displayPrice.toLocaleString()}. Is it still available?`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Seller on WhatsApp
            </a>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
              💡 Payment is arranged directly with the seller — M-Pesa, cash, or bank transfer.
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { icon: Shield, label: 'Buyer Protection' },
                { icon: Truck, label: listing.delivery_available ? `Delivery: KES ${listing.delivery_cost || 0}` : 'Self-pickup' },
                { icon: RotateCcw, label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <Icon className="h-5 w-5 text-orange-400" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* Location + meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.location}</span>
              <span>{listing.views?.toLocaleString() || 0} views</span>
              <span>{new Date(listing.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Description + Seller info side by side */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-lg text-gray-900 dark:text-white mb-3">Product Description</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>

              {listing.seo_tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {listing.seo_tags.map((tag: string) => (
                    <Link key={tag} href={`/listings?search=${encodeURIComponent(tag)}`}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Related Listings */}
            {relatedListings.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-lg text-gray-900 dark:text-white mb-4">More in {listing.category}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relatedListings.map(rel => (
                    <Link key={rel.id} href={`/listings/${rel.id}`}
                      className="group rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        {rel.images?.[0] ? (
                          <img src={rel.images[0]} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-semibold text-gray-800 dark:text-white line-clamp-2 leading-tight">{rel.title}</p>
                        <p className="text-xs font-black text-orange-500 mt-0.5">KES {rel.price?.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Seller info */}
          <div className="space-y-4">
            {seller && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="font-black text-base text-gray-900 dark:text-white mb-4">About the Seller</h2>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex-shrink-0 overflow-hidden">
                    {seller.logo_url ? (
                      <img src={seller.logo_url} alt={seller.business_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-orange-500 font-black text-lg">
                        {(seller.business_name || 'S')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{seller.business_name || 'Seller'}</p>
                      {seller.verified && <BadgeCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                    </div>
                    {seller.rating > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                        <span className="text-xs text-gray-500">{seller.rating.toFixed(1)} ({seller.total_reviews || 0} reviews)</span>
                      </div>
                    )}
                    {seller.total_sales > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5">{seller.total_sales} sales</p>
                    )}
                    {seller.response_time_hours && (
                      <p className="text-xs text-gray-400 mt-0.5">Replies within {seller.response_time_hours}h</p>
                    )}
                  </div>
                </div>

                <Link
                  href={`/listings?seller_id=${listing.seller_id}`}
                  className="mt-4 block text-center text-sm text-orange-500 hover:text-orange-600 font-semibold border border-orange-200 dark:border-orange-800 rounded-lg py-2 transition-colors"
                >
                  View All Listings
                </Link>
              </div>
            )}

            {/* Quick cart summary */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4">
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">Ready to buy?</p>
              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-400 hover:bg-orange-500 text-gray-900 font-black py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart — KES {(displayPrice * quantity).toLocaleString()}
              </button>
              <Link href="/checkout" className="block text-center text-xs text-orange-600 dark:text-orange-400 mt-2 hover:underline">
                Go to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
