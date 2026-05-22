'use client'

import Link from 'next/link'
import { Heart, MapPin, Star, BadgeCheck, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'

export interface Listing {
  id: string
  title: string
  price: number
  category: string
  location: string
  images?: string[]
  listing_images?: { url: string; is_primary: boolean; order_index?: number }[]
  condition?: string
  discount_percent?: number
  is_negotiable?: boolean
  delivery_available?: boolean
  featured?: boolean
  stock_quantity?: number
  sellers?: { business_name?: string; verified?: boolean; rating?: number }
  created_at?: string
}

interface ProductCardProps {
  listing: Listing
  onFavorite?: (id: string) => void
  isFavorited?: boolean
}

function getPrimaryImage(listing: Listing): string {
  const imgs = listing.listing_images ?? []
  const primary = imgs.find(i => i.is_primary) ?? imgs.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))[0]
  if (primary) return primary.url
  if (listing.images && listing.images.length > 0) return listing.images[0]
  return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80'
}

export default function ProductCard({ listing, onFavorite, isFavorited = false }: ProductCardProps) {
  const [favorited, setFavorited] = useState(isFavorited)
  const [imgError, setImgError] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  const image = imgError
    ? 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80'
    : getPrimaryImage(listing)

  const discountPercent = listing.discount_percent ?? 0
  const discountedPrice = discountPercent > 0 ? listing.price * (1 - discountPercent / 100) : null
  const displayPrice = discountedPrice ?? listing.price

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorited(f => !f)
    onFavorite?.(listing.id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const user = getUser()
    if (!user) { router.push('/login'); return }
    addItem({
      listing_id: listing.id,
      title: listing.title,
      price: displayPrice,
      quantity: 1,
      image,
      seller_id: undefined,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200 flex flex-col"
    >
      {/* ── Image ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none">
              -{Math.round(discountPercent)}%
            </span>
          )}
          {listing.featured && (
            <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none">
              HOT
            </span>
          )}
          {listing.condition === 'new' && !discountPercent && (
            <span className="bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none">
              NEW
            </span>
          )}
          {listing.condition === 'used' && (
            <span className="bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none">
              USED
            </span>
          )}
        </div>

        {/* Favourite */}
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 bg-white hover:bg-red-50 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
          aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-3.5 w-3.5 transition-colors ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Out of stock overlay */}
        {listing.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Details ───────────────────────────────────── */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        {/* Category */}
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide truncate">{listing.category}</p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors min-h-[2.5rem]">
          {listing.title}
        </h3>

        {/* Rating */}
        {listing.sellers?.rating && listing.sellers.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  className={`h-3 w-3 ${s <= Math.round(listing.sellers!.rating!) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">{listing.sellers.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Price block */}
        <div className="mt-auto pt-1.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-black text-gray-900">
              KES {Math.round(displayPrice).toLocaleString()}
            </span>
            {discountedPrice && (
              <span className="text-xs text-gray-400 line-through">
                KES {listing.price.toLocaleString()}
              </span>
            )}
          </div>
          {/* Tags row */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <MapPin className="h-2.5 w-2.5" />
              <span className="truncate max-w-[70px]">{listing.location}</span>
            </span>
            {listing.sellers?.verified && (
              <span title="Verified seller" className="flex-shrink-0">
                <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
              </span>
            )}
            {listing.is_negotiable && (
              <span className="text-[10px] text-green-600 font-semibold">Nego.</span>
            )}
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={listing.stock_quantity === 0}
          className={`mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${
            listing.stock_quantity === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : addedToCart
              ? 'bg-green-500 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {listing.stock_quantity === 0 ? 'Out of Stock' : addedToCart ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}
