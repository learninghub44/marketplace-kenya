"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Plus, Minus, MapPin, Phone, ArrowRight, ShoppingCart, CheckCircle, Loader2, MessageCircle, Info } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useCart } from '@/store/cart'
import { getUser, authHeaders } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

const COUNTIES = ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Meru','Nyeri','Kakamega','Garissa','Kisii','Machakos','Embu','Kitale','Malindi','Other']

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
    preferred_payment: 'mpesa',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  if (!user) return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
        <ShoppingCart className="h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-black dark:text-white">Sign in to continue</h2>
        <Link href="/login" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-3 rounded-xl">Sign In</Link>
      </div>
      <Footer />
    </div>
  )

  if (success) return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center p-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <div>
          <h2 className="text-3xl font-black dark:text-white mb-2">Request Sent!</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Your order request has been sent to the seller. They will contact you to confirm delivery and payment details.
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 max-w-sm w-full text-sm text-gray-600 dark:text-gray-300 text-left space-y-2">
          <p className="font-bold text-orange-600 dark:text-orange-400">What happens next?</p>
          <p>1. The seller will review your order and reach out via phone or platform message.</p>
          <p>2. You and the seller agree on delivery method and payment (M-Pesa, cash on delivery, etc.).</p>
          <p>3. Payment is made directly to the seller — Sokoni Kenya does not handle payments.</p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/buyer" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-3 rounded-xl">My Orders</Link>
          <Link href="/listings" className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold px-6 py-3 rounded-xl">Continue Shopping</Link>
        </div>
      </div>
      <Footer />
    </div>
  )

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
        <ShoppingCart className="h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-black dark:text-white">Your cart is empty</h2>
        <Link href="/listings" className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-6 py-3 rounded-xl">Browse Products</Link>
      </div>
      <Footer />
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/orders/checkout`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ listing_id: i.listing_id, quantity: i.quantity, price: i.price })),
          delivery: { fullName: form.fullName, phone: form.phone, county: form.county, town: form.town, address: form.address, notes: form.delivery_notes },
          preferred_payment: form.preferred_payment,
        }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Failed to place order'); return }
      clearCart()
      setSuccess(true)
    } catch { setError('Could not connect. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Checkout</h1>

        {/* Payment notice */}
        <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-5">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-bold mb-0.5">Payments are arranged directly with sellers</p>
            <p className="text-blue-700 dark:text-blue-400">Sokoni Kenya does not process payments. After placing your order, the seller will contact you to agree on payment — M-Pesa, cash on delivery, or another method that works for both of you.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">

              {/* Delivery details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-400" /> Delivery Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { k: 'fullName', label: 'Full Name', ph: 'John Kamau', type: 'text', required: true },
                    { k: 'phone', label: 'Phone Number', ph: '+254 7XX XXX XXX', type: 'tel', required: true },
                    { k: 'town', label: 'Town / Estate', ph: 'e.g. Westlands', type: 'text', required: true },
                    { k: 'address', label: 'Street / Building', ph: 'e.g. Ngong Road, Apt 4B', type: 'text', required: false },
                  ].map(({ k, label, ph, type, required }) => (
                    <div key={k}>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}{required && ' *'}</label>
                      <input type={type} value={(form as any)[k]} onChange={set(k)} placeholder={ph} required={required}
                        className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">County *</label>
                    <select value={form.county} onChange={set('county')} required
                      className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                      <option value="">Select county</option>
                      {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Notes for seller</label>
                    <input type="text" value={form.delivery_notes} onChange={set('delivery_notes')} placeholder="e.g. Call before delivery"
                      className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>
              </div>

              {/* Payment preference */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-orange-400" /> Payment Preference
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Let the seller know your preferred payment method. Final arrangement is between you and the seller.</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  {[
                    { value: 'mpesa', label: 'M-Pesa', emoji: '📱', desc: 'Pay via M-Pesa' },
                    { value: 'cash', label: 'Cash on Delivery', emoji: '💵', desc: 'Pay when you receive' },
                    { value: 'bank', label: 'Bank Transfer', emoji: '🏦', desc: 'Direct bank transfer' },
                  ].map(m => (
                    <label key={m.value} className={`flex flex-col items-center gap-1.5 p-3 border-2 rounded-xl cursor-pointer transition-all text-center
                      ${form.preferred_payment === m.value ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value={m.value} checked={form.preferred_payment === m.value}
                        onChange={() => setForm(p => ({ ...p, preferred_payment: m.value }))} className="sr-only" />
                      <span className="text-2xl">{m.emoji}</span>
                      <span className={`text-sm font-bold ${form.preferred_payment === m.value ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}>{m.label}</span>
                      <span className="text-xs text-gray-400">{m.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cart items */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4">Items ({count})</h2>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {items.map(item => (
                    <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img src={item.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&q=80'} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2">{item.title}</p>
                        <p className="text-sm font-bold text-orange-500 mt-0.5">KES {item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"><Minus className="h-3 w-3" /></button>
                            <span className="w-7 text-center text-xs font-semibold dark:text-white">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"><Plus className="h-3 w-3" /></button>
                          </div>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">= KES {(item.price * item.quantity).toLocaleString()}</span>
                          <button type="button" onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 ml-auto"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm sticky top-24 space-y-4">
                <h2 className="font-bold text-gray-900 dark:text-white">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({count} items)</span><span>KES {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery</span><span className="text-orange-500 font-semibold">Agreed with seller</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between font-black text-lg text-gray-900 dark:text-white">
                    <span>Total</span><span>KES {total.toLocaleString()}</span>
                  </div>
                </div>

                {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">{error}</div>}

                <button type="submit" disabled={loading || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-gray-900 font-black py-3.5 rounded-xl transition-colors">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</> : <>Send Order Request <ArrowRight className="h-4 w-4" /></>}
                </button>

                <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                  <MessageCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">The seller will contact you to confirm details and arrange payment directly.</p>
                </div>

                <Link href="/listings" className="block text-center text-sm text-orange-500 hover:text-orange-600 font-medium">← Continue Shopping</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}
