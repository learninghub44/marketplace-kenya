"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Eye, EyeOff, Loader2, CheckCircle, User, Mail, Phone, Lock, AlertCircle, RefreshCw, FileText, Shield, X, Check } from 'lucide-react'
import { setAuth } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

async function tryRegister(form: any, attempt = 1): Promise<any> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form), signal: controller.signal,
    })
    clearTimeout(timeout)
    return await res.json()
  } catch (err: any) {
    clearTimeout(timeout)
    if (attempt < 2 && (err?.name === 'AbortError' || err?.name === 'TypeError')) {
      await new Promise(r => setTimeout(r, 3000))
      return tryRegister(form, attempt + 1)
    }
    throw err
  }
}

function TermsModal({ onAgree, onDecline }: { onAgree: () => void; onDecline: () => void }) {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms')

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="bg-gray-900 rounded-t-2xl p-5 text-center flex-shrink-0">
          <h2 className="text-white font-black text-lg">Review & Agree</h2>
          <p className="text-gray-400 text-xs mt-1">You must agree to both documents to create an account</p>
        </div>

        <div className="flex border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          {[{ k: 'terms', label: 'Terms of Service', icon: FileText }, { k: 'privacy', label: 'Privacy Policy', icon: Shield }].map(({ k, label, icon: Icon }) => (
            <button key={k} onClick={() => setTab(k as any)}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors
                ${tab === k ? 'border-b-2 border-orange-400 text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
          {tab === 'terms' && (
            <>
              <p className="font-bold text-gray-800 dark:text-white text-base">Terms of Service</p>
              {[
                ['Eligibility', 'You must be 18 or older and provide accurate information. You must have legal ownership of items you list.'],
                ['Sellers', 'Only list items you legally own. Provide honest descriptions. Prohibited items include weapons, drugs, stolen goods, and counterfeit products. Violations result in permanent bans.'],
                ['Buyers', 'Communicate honestly. Verify goods before paying. Always meet in safe, public locations for exchanges.'],
                ['Payments', 'Payments are processed via M-Pesa by Safaricom. We never see or store your PIN. Activated seller packages are non-refundable.'],
                ['Moderation', 'All listings are reviewed before going live. We can remove listings or suspend accounts that violate these terms.'],
                ['Liability', 'We provide a marketplace platform, not a guarantee. We are not responsible for disputes, item quality, or financial losses.'],
              ].map(([title, text]) => (
                <div key={title} className="border-l-2 border-orange-300 pl-3">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wide mb-0.5">{title}</p>
                  <p className="text-xs">{text}</p>
                </div>
              ))}
              <a href="/legal/terms.pdf" target="_blank" className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-xs font-semibold">
                <FileText className="h-3.5 w-3.5" /> Download full Terms PDF
              </a>
            </>
          )}
          {tab === 'privacy' && (
            <>
              <p className="font-bold text-gray-800 dark:text-white text-base">Privacy Policy</p>
              {[
                ['What We Collect', 'Your name, email, optional phone number, and role when registering. Listing content and photos you upload. M-Pesa payment confirmations only.'],
                ['How We Use It', 'To run your account, display listings, enable messaging, send transactional emails like password resets and listing approvals.'],
                ['Who We Share With', 'Safaricom (M-Pesa payments), our email provider (to deliver emails), AI tools for premium listing generation only. No advertisers or data brokers — ever.'],
                ['Your Rights', 'You can access, correct, or delete your data at any time. Contact sokonikenya@gmail.com or WhatsApp 0701 059 192.'],
                ['Security', 'Passwords are encrypted with bcrypt. All connections use HTTPS. You are notified within 72 hours of any data breach affecting your data.'],
                ['No Tracking', 'We do not use advertising cookies, Google Analytics, or any tracking technologies. Your login is stored only in your browser.'],
              ].map(([title, text]) => (
                <div key={title} className="border-l-2 border-blue-300 pl-3">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wide mb-0.5">{title}</p>
                  <p className="text-xs">{text}</p>
                </div>
              ))}
              <a href="/legal/privacy.pdf" target="_blank" className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-xs font-semibold">
                <Shield className="h-3.5 w-3.5" /> Download full Privacy Policy PDF
              </a>
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2 flex-shrink-0">
          <p className="text-xs text-gray-400 text-center">By clicking <strong>I Agree</strong>, you confirm you have read and accept both documents.</p>
          <button onClick={onAgree}
            className="w-full bg-orange-400 hover:bg-orange-500 text-gray-900 font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Check className="h-4 w-4" /> I Agree — Create My Account
          </button>
          <button onClick={onDecline}
            className="w-full border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
            <X className="h-4 w-4" /> I Decline — Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'buyer', phone: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    setError('')
    setShowModal(true)
  }

  const handleAgree = async () => {
    setShowModal(false)
    setLoading(true); setStatus('Creating your account…')
    try {
      const data = await tryRegister(form)
      if (!data.success) { setError(data.error || 'Registration failed. Please try again.'); setStatus(''); return }
      setStatus('Account created! Redirecting…')
      setAuth(data.token, data.user)
      setSuccess(true)
      setTimeout(() => router.push(data.user.role === 'seller' ? '/seller' : '/buyer'), 1800)
    } catch (err: any) {
      setStatus('')
      setError(err?.name === 'AbortError' || err?.name === 'TypeError'
        ? 'The server is not responding. Please check your connection and try again.'
        : 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center max-w-sm w-full space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">You&apos;re in! 🎉</h2>
        <p className="text-gray-500 text-sm">Account created. Redirecting to your dashboard…</p>
        <div className="w-full bg-orange-100 rounded-full h-1.5"><div className="bg-orange-400 h-1.5 rounded-full w-3/4 animate-pulse" /></div>
      </div>
    </div>
  )

  return (
    <>
      {showModal && <TermsModal onAgree={handleAgree} onDecline={() => setShowModal(false)} />}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-x-hidden">
        <nav className="bg-gray-900 py-3 px-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 w-fit mx-auto">
            <div className="bg-orange-400 p-1.5 rounded-lg"><ShoppingBag className="h-5 w-5 text-gray-900" /></div>
            <span className="font-black text-orange-400 text-lg">Sokoni Kenya</span>
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-center">
                <h1 className="text-2xl font-black text-white">Create Free Account</h1>
                <p className="text-gray-400 text-sm mt-1">Buy and sell across all 47 counties in Kenya</p>
              </div>

              <div className="p-6">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-5">
                  {[{ r: 'buyer', label: '🛒 I want to Buy' }, { r: 'seller', label: '🏪 I want to Sell' }].map(({ r, label }) => (
                    <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${form.role === r ? 'bg-orange-400 text-gray-900 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                      {label}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 mb-4 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p>{error}</p>
                      {!loading && <button onClick={() => setShowModal(true)} className="mt-1 flex items-center gap-1 text-orange-500 text-xs font-semibold"><RefreshCw className="h-3 w-3" /> Try again</button>}
                    </div>
                  </div>
                )}

                {loading && status && (
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
                    <Loader2 className="h-4 w-4 animate-spin" /> {status}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {[
                    { k: 'name', label: 'Full Name', Icon: User, ph: 'John Kamau', type: 'text', req: true },
                    { k: 'email', label: 'Email Address', Icon: Mail, ph: 'you@email.com', type: 'email', req: true },
                    { k: 'phone', label: 'Phone Number', Icon: Phone, ph: '+254 700 000 000', type: 'tel', req: false, opt: true },
                  ].map(({ k, label, Icon, ph, type, req, opt }) => (
                    <div key={k}>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {label} {opt && <span className="text-gray-400 font-normal text-xs">(optional)</span>}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type={type} value={(form as any)[k]} onChange={set(k)} required={req}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder={ph} />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Password <span className="text-gray-400 font-normal text-xs">(min. 8 chars)</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} required minLength={8}
                        className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Min. 8 characters" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                    <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Repeat password" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {status || 'Please wait…'}</> : 'Continue →'}
                  </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Already have an account? <Link href="/login" className="text-orange-500 font-semibold">Sign in</Link>
                </p>
                <p className="mt-2 text-center text-xs text-gray-400">
                  You&apos;ll be asked to review our{' '}
                  <a href="/legal/terms.pdf" target="_blank" className="text-orange-500">Terms</a> &amp;{' '}
                  <a href="/legal/privacy.pdf" target="_blank" className="text-orange-500">Privacy Policy</a>{' '}
                  before your account is created.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
