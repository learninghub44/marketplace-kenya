"use client"
import { Heart, MapPin, Tag, MessageCircle, BadgeCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { SUPPORT_WHATSAPP_NUMBER } from '@/lib/constants'

export interface ProductCardListing {
  id: string
  title: string
  price: number
  category?: string
  location?: string
  images?: string[]
  description?: string
}

export type ProductCardView = 'grid' | 'list' | 'compact'

interface ProductCardProps {
  listing: ProductCardListing
  view?: ProductCardView
  favorited?: boolean
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void
  /** Only render the verification badge when the API actually tells us the seller is verified. */
  sellerVerified?: boolean
}

/**
 * Single source of truth for how a listing is rendered as a card across the
 * marketplace (listings grid/list, homepage featured rails, related listings,
 * favorites, seller storefronts). Three density levels:
 *  - grid: default browsing view, image-forward
 *  - list: wider row, shows description, used for "list view" toggle
 *  - compact: small footprint for rails/carousels (e.g. "related listings")
 */
export default function ProductCard({ listing, view = 'grid', favorited = false, onToggleFavorite, sellerVerified }: ProductCardProps) {
  const whatsappHref = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I'm interested in: ${listing.title} - KES ${listing.price?.toLocaleString()}`
  )}`

  const isList = view === 'list'
  const isCompact = view === 'compact'

  // NOTE: card-level navigation to /listings/[id] is wired up once the listing
  // detail page ships (next stage). For now this renders as a non-link
  // container, matching current production behavior exactly.
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group ${isList ? 'flex gap-3' : ''}`}
    >
      <div className={`relative flex-shrink-0 ${isList ? 'w-28 h-28' : isCompact ? 'h-28' : 'h-44'} overflow-hidden`}>
        {listing.images?.[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Tag className="h-8 w-8 text-gray-300" />
          </div>
        )}

        {onToggleFavorite && (
          <button
            onClick={e => onToggleFavorite(listing.id, e)}
            className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full shadow hover:scale-110 transition-transform"
            aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`h-3.5 w-3.5 ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        )}

        {listing.category && !isCompact && (
          <span className="absolute top-2 left-2 bg-gray-900/70 text-white text-xs px-1.5 py-0.5 rounded">{listing.category}</span>
        )}
      </div>

      <div className={`p-3 flex flex-col justify-between flex-1 ${isList ? 'py-3' : ''} ${isCompact ? 'p-2' : ''}`}>
        <div className="space-y-1">
          <h3 className={`font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {listing.title}
          </h3>
          <p className={`text-orange-500 font-black ${isCompact ? 'text-sm' : 'text-base'}`}>{formatCurrency(listing.price)}</p>

          {listing.location && (
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" />{listing.location}
              {sellerVerified && (
                <span className="inline-flex items-center gap-0.5 text-blue-500 ml-1">
                  <BadgeCheck className="h-3 w-3" />Verified
                </span>
              )}
            </p>
          )}

          {isList && listing.description && (
            <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 hidden sm:block">{listing.description}</p>
          )}
        </div>

        {!isCompact && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg font-semibold transition-colors"
          >
            <MessageCircle className="h-3 w-3" />Contact Seller
          </a>
        )}
      </div>
    </div>
  )
}
