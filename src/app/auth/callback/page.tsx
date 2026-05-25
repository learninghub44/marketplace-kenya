'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useAuth } from '@clerk/nextjs'
import { setAuth } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya-1.onrender.com'

export default function AuthCallback() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState('Completing sign in…')

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { router.push('/sign-in'); return }
    sync()
  }, [isLoaded, user])

  const sync = async () => {
    try {
      setStatus('Setting up your account…')
      const token = await getToken()
      const res = await fetch(`${API}/api/auth/clerk-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ clerk_id: user!.id, email: user!.primaryEmailAddress?.emailAddress, name: user!.fullName || user!.firstName || '', avatar_url: user!.imageUrl }),
      })
      const data = await res.json()
      if (data.success) {
        setAuth(data.token, data.user)
        router.push(data.user.role === 'admin' ? '/admin' : data.user.role === 'seller' ? '/seller' : '/buyer')
      } else {
        router.push('/onboarding')
      }
    } catch { setTimeout(() => router.push('/onboarding'), 1000) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      <p className="text-gray-500 text-sm">{status}</p>
    </div>
  )
}
