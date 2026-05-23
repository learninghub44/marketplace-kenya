"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getUser, authHeaders } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'Pending',    color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400',  icon: Clock },
  paid:       { label: 'Paid',       color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',          icon: CheckCircle },
  processing: { label: 'Processing', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400',  icon: RefreshCw },
  shipped:    { label: 'Shipped',    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400',  icon: Truck },
  delivered:  { label: 'Delivered',  color: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400',      icon: CheckCircle },
  completed:  { label: 'Completed',  color: 'text-green-700 bg-green-100 dark:bg-green-900/40 dark:text-green-300',     icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400',              icon: XCircle },
  returned:   { label: 'Returned',   color: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300',            icon: RefreshCw },
  refunded:   { label: 'Refunded',   color: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300',            icon: CheckCircle },
}

const STATUS_FILTERS = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled']

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const user = getUser()

  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ limit: '50' })
        if (statusFilter !== 'all') params.set('status', statusFilter)
        const res = await fetch(`${API_BASE}/api/orders?${params}`, { headers: authHeaders() })
        const data = await res.json()
        if (data.success) setOrders(data.orders || [])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [statusFilter])

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Link href="/login" className="bg-orange-400 text-gray-900 font-bold px-6 py-3 rounded-xl">Sign In</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-3xl flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-6 w-6 text-orange-400" />
          <h1 className="text-2xl font-black dark:text-white">My Orders</h1>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-5">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors flex-shrink-0 ${
                statusFilter === s
                  ? 'bg-orange-400 text-gray-900'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300'
              }`}
            >
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold dark:text-white">No orders yet</h3>
            <p className="text-gray-400 text-sm mt-1">Your orders will appear here once you make a purchase</p>
            <Link href="/listings" className="mt-4 inline-block bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
              const Icon = cfg.icon
              const itemCount = order.order_items?.length || 0
              return (
                <li key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-gray-400 mb-1">{order.order_number}</p>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-orange-500 font-black mt-0.5">KES {order.total_amount?.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                          <Icon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                        <Link
                          href={`/buyer/orders/${order.id}`}
                          className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-semibold"
                        >
                          View details <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Footer />
    </div>
  )
}
