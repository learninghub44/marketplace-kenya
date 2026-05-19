"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Listing, Report, SupportTicket } from '@/types'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    totalListings: 0,
    pendingListings: 0,
    activeListings: 0,
    totalRevenue: 0,
    reports: 0,
    openTickets: 0,
  })
  const [pendingListings, setPendingListings] = useState<Listing[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, listingsRes, reportsRes, ticketsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/listings?status=pending'),
        fetch('/api/admin/reports?status=pending'),
        fetch('/api/admin/tickets?status=open'),
      ])

      const statsData = await statsRes.json()
      const listingsData = await listingsRes.json()
      const reportsData = await reportsRes.json()
      const ticketsData = await ticketsRes.json()

      if (statsData.success) setStats(statsData.stats)
      if (listingsData.success) setPendingListings(listingsData.listings)
      if (reportsData.success) setReports(reportsData.reports)
      if (ticketsData.success) setTickets(ticketsData.tickets)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleApproveListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}/approve`, {
        method: 'POST',
      })
      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Failed to approve listing:', error)
    }
  }

  const handleRejectListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}/reject`, {
        method: 'POST',
      })
      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Failed to reject listing:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => router.push('/admin/users')}>
              Users
            </Button>
            <Button variant="ghost" onClick={() => router.push('/admin/listings')}>
              Listings
            </Button>
            <Button variant="ghost" onClick={fetchDashboardData}>
              Refresh
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-500">
                    {stats.totalSellers} sellers, {stats.totalBuyers} buyers
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalListings}</div>
                  <div className="text-sm text-gray-500">
                    {stats.activeListings} active, {stats.pendingListings} pending
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Free</div>
                  <div className="text-sm text-gray-500">Payment gateway removed</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Open Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.reports + stats.openTickets}</div>
                  <div className="text-sm text-gray-500">
                    {stats.reports} reports, {stats.openTickets} tickets
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending Listings ({pendingListings.length})
                </TabsTrigger>
                <TabsTrigger value="reports">
                  Reports ({reports.length})
                </TabsTrigger>
                <TabsTrigger value="tickets">
                  Support Tickets ({tickets.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                {pendingListings.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12 text-gray-500">
                      No pending listings
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingListings.map((listing) => (
                      <Card key={listing.id}>
                        <CardHeader>
                          <CardTitle>{listing.title}</CardTitle>
                          <CardDescription>
                            {listing.category} • KES {listing.price} • {listing.location}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4 line-clamp-2">{listing.description}</p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveListing(listing.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleRejectListing(listing.id)}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/admin/listings/${listing.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reports">
                {reports.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12 text-gray-500">
                      No pending reports
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <Card key={report.id}>
                        <CardHeader>
                          <CardTitle>{report.reason}</CardTitle>
                          <CardDescription>
                            Reported: {new Date(report.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4">{report.description}</p>
                          <Button onClick={() => router.push(`/admin/reports/${report.id}`)}>
                            Review Report
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tickets">
                {tickets.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12 text-gray-500">
                      No open tickets
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <Card key={ticket.id}>
                        <CardHeader>
                          <CardTitle>{ticket.subject}</CardTitle>
                          <CardDescription>
                            Priority: {ticket.priority} • {new Date(ticket.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4 line-clamp-2">{ticket.message}</p>
                          <Button onClick={() => router.push(`/admin/tickets/${ticket.id}`)}>
                            Respond
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
