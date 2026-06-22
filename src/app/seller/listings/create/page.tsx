"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Sparkles, Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { getToken, getUser, authHeaders } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const CATEGORIES = ['Electronics','Fashion','Home & Garden','Vehicles','Agriculture','Sports','Baby & Kids','Property','Services','Health & Beauty','Business','Education']
const LOCATIONS = ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Malindi','Kitale','Nyeri','Garissa','Kakamega','Meru']

export default function CreateListingPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title:'', description:'', price:'', category:'', location:'', images:[] as string[] })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [aiUsed, setAiUsed] = useState(false)

  useEffect(() => {
    const u = getUser()
    if (!u || u.role !== 'seller') router.push('/login')
  }, [])

  const generateWithAI = async () => {
    if (!form.title || !form.category) return setError('Enter a product name and select a category first')
    setAiLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate-listing`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ productName: form.title, category: form.category }),
      })
      const data = await res.json()
      if (data.success && data.data?.description) {
        setForm(f => ({ ...f, description: data.data.description }))
        setAiUsed(true)
      } else setError('AI generation failed. Write your description manually.')
    } catch { setError('AI unavailable. Please write your description manually.') }
    finally { setAiLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/listings`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      })
      const data = await res.json()
      if (data.success) setSuccess(true)
      else setError(data.error || 'Failed to create listing')
    } catch { setError('Connection failed. Try again.') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-black text-gray-900">Listing Submitted!</h2>
        <p className="text-gray-500 text-sm">Your listing is under review by our admin team. We'll notify you by email once it goes live (usually within 24 hours).</p>
        <div className="flex gap-3">
          <button onClick={() => { setSuccess(false); setForm({ title:'', description:'', price:'', category:'', location:'', images:[] }) }}
            className="flex-1 border border-orange-400 text-orange-500 font-bold py-2 rounded-lg text-sm">Add Another</button>
          <Link href="/seller" className="flex-1 bg-orange-400 text-gray-900 font-bold py-2 rounded-lg text-sm text-center">Dashboard</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
          <ShoppingBag className="h-6 w-6 text-orange-400" />
          <span className="font-black text-orange-400">Create New Listing</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
            <h1 className="text-xl font-black text-white">List Your Product</h1>
            <p className="text-gray-400 text-sm mt-1">Fill in the details below. Our admin will review and approve within 24 hours.</p>
          </div>

          <div className="p-6">
            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm"><AlertCircle className="h-4 w-4 flex-shrink-0"/>{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                  <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g. Samsung Galaxy A55" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (KES) *</label>
                  <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g. 15000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
                  <select value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    <option value="">Select location</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-700">Description *</label>
                  <button type="button" onClick={generateWithAI} disabled={aiLoading}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${aiUsed ? 'bg-green-100 text-green-700' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>
                    {aiLoading ? <><Loader2 className="h-3 w-3 animate-spin"/>Generating...</> : <><Sparkles className="h-3 w-3"/>{aiUsed ? ' AI Generated' : 'Generate with AI'}</>}
                  </button>
                </div>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  placeholder="Describe your product in detail — condition, features, why someone should buy it..." />
                {aiUsed && <p className="text-xs text-green-600 mt-1"> AI-generated description — review and edit as needed</p>}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                <p className="font-semibold"> Image upload coming soon</p>
                <p className="mt-1 text-blue-500">For now, you can add image URLs or our team will contact you. WhatsApp images to <strong>0742 791 838</strong>.</p>
              </div>

              <div className="flex gap-3">
                <Link href="/seller" className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg text-sm text-center transition-colors">Cancel</Link>
                <button type="submit" disabled={loading} className="flex-1 bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-black py-3 rounded-lg flex items-center justify-center gap-2 text-sm">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin"/>Submitting...</> : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
