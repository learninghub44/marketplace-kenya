'use client'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn) { router.push('/auth/callback'); return }
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
    const domain = key.includes('_live_') ? 'accounts.clerk.com' : 'accounts.dev'
    window.location.href = `https://${domain}/sign-in?redirect_url=${encodeURIComponent(window.location.origin + '/auth/callback')}`
  }, [isLoaded, isSignedIn])
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
        </div>
        <p className="text-gray-500 text-sm">Redirecting to sign in…</p>
        <Link href="/" className="block text-xs text-orange-500">← Back to home</Link>
      </div>
    </div>
  )
}
