"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import type { Listing } from '@/types'

export default function BuyerDashboard() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/listings?status=active')
      const data = await response.json()
      if (data.success) {
        setListings(data.listings)
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/listings?search=${searchQuery}&category=${selectedCategory}`)
      const data = await response.json()
      if (data.success) {
        setListings(data.listings)
      }
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  const handleAddToFavorites = async (listingId: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      })
      if (response.ok) {
        alert('Added to favorites!')
      }
    } catch (error) {
      console.error('Failed to add to favorites:', error)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Kenya Marketplace</h1>
          <nav className="flex gap-4">
            <Link href="/buyer/favorites">
              <Button variant="ghost">Favorites</Button>
            </Link>
            <Link href="/buyer/messages">
              <Button variant="ghost">Messages</Button>
            </Link>
            <Link href="/buyer/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Find Products</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white dark:bg-gray-700"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Sports">Sports</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Services">Services</option>
            </select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No listings found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                {listing.images.length > 0 && (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                  <CardDescription>{listing.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(listing.price)}
                    </span>
                    <span className="text-sm text-gray-500">{listing.location}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/product/${listing.id}`} className="flex-1">
                      <Button className="w-full">View Details</Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleAddToFavorites(listing.id)}
                    >
                      ❤
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
