'use client';

import Link from 'next/link';
import { Heart, MapPin, Star, BadgeCheck, Tag } from 'lucide-react';
import { useState } from 'react';

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  images?: string[];
  listing_images?: { url: string; is_primary: boolean }[];
  condition?: string;
  discount_percent?: number;
  is_negotiable?: boolean;
  delivery_available?: boolean;
  featured?: boolean;
  sellers?: {
    business_name?: string;
    verified?: boolean;
    rating?: number;
  };
  created_at?: string;
}

interface ProductCardProps {
  listing: Listing;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

function getPrimaryImage(listing: Listing): string {
  const primary = listing.listing_images?.find(i => i.is_primary);
  if (primary) return primary.url;
  if (listing.listing_images && listing.listing_images.length > 0) return listing.listing_images[0].url;
  if (listing.images && listing.images.length > 0) return listing.images[0];
  return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function ProductCard({ listing, onFavorite, isFavorited = false }: ProductCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [imgError, setImgError] = useState(false);

  const image = imgError
    ? 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80'
    : getPrimaryImage(listing);

  const discountedPrice = listing.discount_percent && listing.discount_percent > 0
    ? listing.price * (1 - listing.discount_percent / 100)
    : null;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(f => !f);
    onFavorite?.(listing.id);
  };

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
        <img
          src={image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {listing.featured && (
            <span className="bg-orange-400 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              Featured
            </span>
          )}
          {listing.discount_percent && listing.discount_percent > 0 ? (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              -{listing.discount_percent}%
            </span>
          ) : null}
          {listing.condition && listing.condition !== 'new' && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize">
              {listing.condition}
            </span>
          )}
        </div>
        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-3.5 w-3.5 transition-colors ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
        {/* Image count */}
        {(listing.listing_images?.length || listing.images?.length || 0) > 1 && (
          <div className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Tag className="h-2.5 w-2.5" />
            {listing.listing_images?.length || listing.images?.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide truncate">{listing.category}</p>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">
          {listing.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-base font-black text-gray-900 dark:text-white">
            KES {(discountedPrice ?? listing.price).toLocaleString()}
          </span>
          {discountedPrice && (
            <span className="text-xs text-gray-400 line-through">
              KES {listing.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Negotiable / Delivery tags */}
        {(listing.is_negotiable || listing.delivery_available) && (
          <div className="flex gap-1 flex-wrap">
            {listing.is_negotiable && (
              <span className="text-[10px] bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-medium">
                Negotiable
              </span>
            )}
            {listing.delivery_available && (
              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-medium">
                Delivery
              </span>
            )}
          </div>
        )}

        {/* Location + seller */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 min-w-0">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="text-[11px] truncate">{listing.location}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {listing.sellers?.verified && (
              <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
            )}
            {listing.sellers?.rating && listing.sellers.rating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                <span className="text-[11px] text-gray-500">{listing.sellers.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {listing.created_at && (
          <p className="text-[10px] text-gray-400">{timeAgo(listing.created_at)}</p>
        )}
      </div>
    </Link>
  );
}
