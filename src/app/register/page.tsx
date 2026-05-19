"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'


export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email:'', password:'', confirmPassword:'', role:'buyer', phone:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (formData.password !== formData.confirmPassword) return setError('Passwords do not match')
    setLoading(true); setError('')
    const r = await fetch(`${API_BASE}/api/auth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(formData)})
    const d = await r.json(); if (!d.success) setError(d.error || 'Registration failed'); else router.push('/login?verify=email'); setLoading(false)
  }

  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4"><Card className="w-full max-w-md"><CardHeader><CardTitle className="text-2xl text-center">Create Account</CardTitle><CardDescription className="text-center">Registration with verification</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit} className="space-y-4">{error && <div className="text-sm text-red-600">{error}</div>}<div><Label>Role</Label><Select value={formData.role} onValueChange={(value)=>setFormData({...formData, role:value})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="buyer">Buyer</SelectItem><SelectItem value="seller">Seller</SelectItem></SelectContent></Select></div><div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} required /></div><div><Label>Phone</Label><Input type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})} /></div><div><Label>Password</Label><Input type="password" minLength={8} value={formData.password} onChange={(e)=>setFormData({...formData,password:e.target.value})} required /></div><div><Label>Confirm</Label><Input type="password" minLength={8} value={formData.confirmPassword} onChange={(e)=>setFormData({...formData,confirmPassword:e.target.value})} required /></div><Button className="w-full" disabled={loading}>{loading?'Creating...':'Create account'}</Button></form><div className="text-sm text-center mt-4">Already registered? <Link href="/login" className="text-blue-600">Login</Link></div></CardContent></Card></div>
}
