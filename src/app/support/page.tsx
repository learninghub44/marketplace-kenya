"use client"
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Phone, Mail, MessageCircle, Clock, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

const faqs = [
  { q: 'How do I create a seller account?', a: 'Click "Create Free Account" on the homepage, choose "Seller" as your role, and fill in your details. Your account is ready immediately.' },
  { q: 'How do I list a product?', a: 'Log in as a seller, go to your Seller Dashboard, click "New Listing", fill in product details, and submit. Our team reviews it within 24 hours.' },
  { q: 'How do buyers contact sellers?', a: 'Buyers can click "Message Seller" on any listing to send a direct message, or contact via phone/WhatsApp if the seller has shared those details.' },
  { q: 'Is Sokoni Kenya really free?', a: 'Yes! Listing products is completely free. We never charge commissions or hidden fees.' },
  { q: 'How do I pay for items?', a: 'Payments are arranged directly between buyers and sellers. We recommend M-Pesa for safe and instant transactions.' },
  { q: 'What if I receive a fake or wrong item?', a: 'Report the listing immediately using the "Report" button on the listing page. Our admin team investigates within 24 hours.' },
  { q: 'How do I reset my password?', a: 'Click "Forgot password?" on the login page, enter your email, and we\'ll send a reset link instantly.' },
  { q: 'Can I sell products from outside Kenya?', a: 'Currently Sokoni Kenya is focused on Kenyan sellers and buyers. All transactions should be in KES.' },
]

export default function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', priority: 'medium' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/support`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else setError(data.error || 'Failed to submit. Please try again.')
    } catch { setError('Connection failed. Try WhatsApp instead.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Nav */}
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-orange-400" />
            <span className="font-black text-orange-400 text-lg">Sokoni Kenya</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login" className="text-gray-300 hover:text-white text-sm">Login</Link>
            <Link href="/register" className="bg-orange-400 text-gray-900 font-bold px-3 py-1.5 rounded-lg text-sm">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Support Center</h1>
        <p className="text-gray-400">We're here to help. Get answers fast.</p>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl space-y-10">

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 text-center transition-colors">
            <MessageCircle className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-black text-lg">WhatsApp</h3>
            <p className="text-green-100 text-sm mt-1">0701 059 192</p>
            <p className="text-green-200 text-xs mt-2">Fastest response</p>
          </a>
          <a href="tel:+254701059192" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-center transition-colors">
            <Phone className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-black text-lg">Call Us</h3>
            <p className="text-blue-100 text-sm mt-1">+254 742 791 838</p>
            <p className="text-blue-200 text-xs mt-2">Mon–Sat, 8am–8pm</p>
          </a>
          <a href="mailto:sokonikenya@gmail.com" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-6 text-center transition-colors">
            <Mail className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-black text-lg">Email</h3>
            <p className="text-orange-100 text-sm mt-1">sokonikenya@gmail.com</p>
            <p className="text-orange-200 text-xs mt-2">Reply within 24hrs</p>
          </a>
        </div>

        {/* Response time notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <p className="text-blue-700 text-sm"><strong>Average response time:</strong> WhatsApp within 1 hour · Email within 24 hours · Ticket within 48 hours</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FAQ */}
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="h-4 w-4 text-orange-500 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Form */}
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4">Submit a Support Ticket</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              {sent ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900">Ticket Submitted!</h3>
                  <p className="text-gray-500 text-sm">We've received your message and will respond within 24–48 hours. Check your email for confirmation.</p>
                  <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'', priority:'medium' }) }}
                    className="bg-orange-400 text-gray-900 font-bold px-6 py-2 rounded-lg text-sm">Submit Another</button>
                </div>
              ) : (
                <>
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="John Doe" /></div>
                      <div><label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                        <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="you@email.com" /></div>
                    </div>
                    <div><label className="block text-xs font-semibold text-gray-700 mb-1">Subject *</label>
                      <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Brief description of your issue" /></div>
                    <div><label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
                      <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                        <option value="low">Low – General question</option>
                        <option value="medium">Medium – Account or listing issue</option>
                        <option value="high">High – Payment or fraud issue</option>
                      </select></div>
                    <div><label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                      <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required rows={5}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                        placeholder="Describe your issue in detail..." /></div>
                    <button type="submit" disabled={loading} className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-black py-3 rounded-lg flex items-center justify-center gap-2">
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin"/>Submitting...</> : 'Submit Ticket'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-10 text-center text-sm">
        <p className="text-gray-400">© 2026 Sokoni Kenya · <Link href="/" className="text-orange-400">Home</Link> · <Link href="/listings" className="text-orange-400">Browse</Link> · <Link href="/login" className="text-orange-400">Login</Link></p>
      </footer>
    </div>
  )
}
