"use client"

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const r = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const d = await r.json()

    if (d.success) {
      setMsg('Password reset successful. Redirecting...')
      setTimeout(() => router.push('/login'), 1500)
    } else {
      setMsg(d.error || 'Reset failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              required
            />
            <Button className="w-full">Reset Password</Button>
          </form>
          {msg && <p className="text-sm mt-3">{msg}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
