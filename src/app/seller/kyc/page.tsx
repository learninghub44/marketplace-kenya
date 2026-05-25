'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Shield, CheckCircle, Clock, XCircle, CreditCard, Camera, User, Loader2, AlertCircle } from 'lucide-react'
import { authHeaders } from '@/lib/auth'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya-1.onrender.com'
type KycStatus = 'not_started' | 'pending' | 'approved' | 'rejected'

export default function KycPage() {
  const { user } = useUser()
  const [status, setStatus] = useState<KycStatus>('not_started')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchStatus() }, [])

  const fetchStatus = async () => {
    try {
      const r = await fetch(`${API}/api/seller/kyc-status`, { headers: authHeaders() })
      const d = await r.json()
      if (d.success) setStatus(d.status)
    } catch {} finally { setLoading(false) }
  }

  const startKyc = async () => {
    setSubmitting(true); setError('')
    try {
      const r = await fetch(`${API}/api/seller/kyc-start`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ email: user?.primaryEmailAddress?.emailAddress, name: user?.fullName }),
      })
      const d = await r.json()
      if (d.success && d.verification_url) {
        window.open(d.verification_url, '_blank', 'width=800,height=700')
        setStatus('pending')
      } else setError(d.error || 'Could not start verification')
    } catch { setError('Something went wrong. Please try again.') }
    finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
    </div>
  )

  const STATES = {
    not_started: { icon: Shield, color: 'text-gray-400', bg: 'bg-gray-50', title: 'Verify Your Identity', desc: 'To list products on Sokoni Kenya, sellers must verify their identity. This takes 2-5 minutes.' },
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', title: 'Verification In Progress', desc: 'Your documents are being reviewed. You will be notified once complete.' },
    approved: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', title: 'Identity Verified', desc: 'Your identity has been verified. You can now create and publish listings.' },
    rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', title: 'Verification Failed', desc: 'Your verification was unsuccessful. Please try again with a clear, valid photo ID.' },
  }
  const s = STATES[status]
  const Icon = s.icon

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-flex p-4 rounded-full ${s.bg} mb-4`}>
            <Icon className={`h-10 w-10 ${s.color}`} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">{s.title}</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">{s.desc}</p>
        </div>

        {status === 'not_started' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5 space-y-4">
            <p className="font-bold text-gray-900 text-sm">What you will need:</p>
            {[
              { icon: CreditCard, title: 'Valid ID', desc: 'National ID, passport, or driving licence' },
              { icon: Camera, title: 'Selfie', desc: 'A clear photo of your face' },
              { icon: User, title: 'Personal details', desc: 'Your name and date of birth' },
            ].map(({ icon: I, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <I className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{title}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
              <Shield className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              Powered by Didit — documents are encrypted and processed securely
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
          </div>
        )}

        <div className="space-y-3">
          {(status === 'not_started' || status === 'rejected') && (
            <button onClick={startKyc} disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-4 rounded-xl transition-colors">
              {submitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Starting…</> : <><Shield className="h-5 w-5" />{status === 'rejected' ? 'Try Again' : 'Start Verification'}</>}
            </button>
          )}
          {status === 'pending' && (
            <button onClick={fetchStatus}
              className="w-full flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-4 rounded-xl">
              <Clock className="h-5 w-5" /> Check Status
            </button>
          )}
          {status === 'approved' && (
            <Link href="/seller/listings/create"
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl">
              Create Your First Listing →
            </Link>
          )}
          <Link href="/seller" className="block w-full text-center py-3 text-gray-400 font-semibold text-sm">← Back to Dashboard</Link>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">Documents processed by Didit — not stored on our servers.</p>
      </div>
    </div>
  )
}
