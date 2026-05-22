"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Plus, Minus, MapPin, Phone, ArrowRight, ShoppingCart, CheckCircle, Loader2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useCart } from '@/store/cart'
import { getUser, authHeaders } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya-1.onrender.com'

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, total, count, clearCart } = useCart()
  const router = useRouter()
  const user = getUser()

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    county: '',
    town: '',
    address: '',
    delivery_notes: '',
    payment_method: 'mpesa',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
          <ShoppingCart className="h-16 w-16 text-gray-300" />
          <h2 className="text-2xl font-black dark:text-white">Sign in to checkout</h2>
          <p className="text-gray-500 dark:text-gray-400">You need to be logged in to place an order.</p>
          <Link href="/login" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-3 rounded-xl">Sign In</Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center p-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black dark:text-white mb-2">Order Placed!</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Your order has been placed successfully. The seller will confirm and update you shortly.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/buyer/orders" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors">
              View My Orders
            </Link>
            <Link href="/listings" className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold px-6 py-3 rounded-xl transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    if (!form.phone || !form.county || !form.town) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/orders/checkout`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_address: {
            full_name: form.fullName,
            phone: form.phone,
            county: form.county,
            town: form.town,
            address: form.address,
          },
          delivery_notes: form.delivery_notes,
          payment_method: form.payment_method,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Checkout failed')
      clearCart()
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
          <ShoppingCart className="h-16 w-16 text-gray-300" />
          <h2 className="text-2xl font-black dark:text-white">Your cart is empty</h2>
          <Link href="/listings" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors">Browse Products</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const deliveryFee = 0

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-5xl flex-1">
        <h1 className="text-2xl font-black dark:text-white mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          {/* Left: delivery form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-400" />
                Delivery Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                  <input type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Phone (M-Pesa) *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="0712345678" required
                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">County *</label>
                  <input type="text" value={form.county} onChange={e => setForm(f => ({ ...f, county: e.target.value }))}
                    placeholder="e.g. Nairobi" required
                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Town / Area *</label>
                  <input type="text" value={form.town} onChange={e => setForm(f => ({ ...f, town: e.target.value }))}
                    placeholder="e.g. Westlands" required
                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Street / Building</label>
                  <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Optional"
                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Delivery Notes</label>
                  <textarea value={form.delivery_notes} onChange={e => setForm(f => ({ ...f, delivery_notes: e.target.value }))}
                    placeholder="Any special instructions for delivery..."
                    rows={2}
                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-orange-400" />
                Payment Method
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { value: 'mpesa', label: 'M-Pesa', emoji: '📱' },
                  { value: 'card', label: 'Card', emoji: '💳' },
                  { value: 'bank', label: 'Bank', emoji: '🏦' },
                ].map(m => (
                  <label key={m.value} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    form.payment_method === m.value
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}>
                    <input type="radio" name="payment" value={m.value} checked={form.payment_method === m.value}
                      onChange={() => setForm(f => ({ ...f, payment_method: m.value }))} className="hidden" />
                    <span className="text-xl">{m.emoji}</span>
                    <span className="font-semibold text-sm dark:text-white">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cart items */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">
                Order Items ({count})
              </h2>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700 space-y-0">
                {items.map(item => (
                  <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img src={item.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&q=80'}
                        alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 leading-tight">{item.title}</p>
                      <p className="text-sm font-bold text-orange-500 mt-0.5">KES {item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold dark:text-white">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">
                          = KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button type="button" onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors ml-auto">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm sticky top-24">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({count} items)</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery</span>
                  <span className="text-green-500 font-semibold">{deliveryFee === 0 ? 'By seller' : `KES ${deliveryFee}`}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2 flex justify-between font-black text-lg text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>KES {(total + deliveryFee).toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-black py-3.5 rounded-xl transition-colors"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Placing Order...</>
                ) : (
                  <>Place Order <ArrowRight className="h-4 w-4" /></>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                By placing this order you agree to our terms and conditions
              </p>

              <Link href="/listings" className="block text-center text-sm text-orange-500 hover:text-orange-600 mt-2 font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
