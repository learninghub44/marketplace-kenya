"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const response = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await response.json()
    if (!data.success) setError(data.error || 'Login failed')
    else router.push(data.user.role === 'buyer' ? '/buyer' : data.user.role === 'seller' ? '/seller' : '/admin')
    setLoading(false)
  }

  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4"><Card className="w-full max-w-md"><CardHeader><CardTitle className="text-2xl text-center">Secure Login</CardTitle><CardDescription className="text-center">Email/password, Google or Apple</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit} className="space-y-4">{error && <div className="text-sm text-red-600">{error}</div>}<div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required /></div><div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required /></div><Link href="/forgot-password" className="text-sm text-blue-600">Forgot password?</Link><Button type="submit" className="w-full" disabled={loading}>{loading?'Signing in...':'Sign in'}</Button><Button type="button" variant="outline" className="w-full" onClick={()=>window.location.href='/api/auth/oauth/google'}>Continue with Google</Button><Button type="button" variant="outline" className="w-full" onClick={()=>window.location.href='/api/auth/oauth/apple'}>Continue with Apple</Button></form><div className="mt-4 text-center text-sm">No account? <Link href="/register" className="text-blue-600">Register</Link></div></CardContent></Card></div>
}
