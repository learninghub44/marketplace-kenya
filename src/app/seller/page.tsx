"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils'
import type { Listing, Seller } from '@/types'

export default function SellerDashboard() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSellerData()
    fetchListings()
  }, [])

  const fetchSellerData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/seller/profile`)
      const data = await response.json()
      if (data.success) {
        setSeller(data.seller)
      }
    } catch (error) {
      console.error('Failed to fetch seller data:', error)
    }
  }

  const fetchListings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/listings/my`)
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

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' })
    router.push('/login')
  }

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      const response = await fetch(`${API_BASE}/api/listings/${listingId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchListings()
      }
    } catch (error) {
      console.error('Failed to delete listing:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Seller Dashboard</h1>
          <nav className="flex gap-4">
            <Link href="/seller/messages">
              <Button variant="ghost">Messages</Button>
            </Link>
            <Link href="/seller/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Link href="/seller/analytics">
              <Button variant="ghost">Analytics</Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{listings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {listings.filter(l => l.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {listings.reduce((sum, l) => sum + l.views, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Package</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Free</div>
              <div className="text-sm text-gray-500">Unlimited usage enabled</div>
            </CardContent>
          </Card>
        </div>

        {/* Package Upgrade Section */}

        {/* Listings Section */}
        <Tabs defaultValue="listings">
          <TabsList>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="create">Create Listing</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No listings yet. Create your first listing!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Card key={listing.id}>
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
                      <CardDescription>
                        {formatCurrency(listing.price)} • {listing.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Link href={`/seller/listings/${listing.id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Listing</CardTitle>
                <CardDescription>
                  <span className="text-green-600">No listing limits. Create and publish freely.</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/seller/listings/create">
                  <Button>
                    Create Listing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
