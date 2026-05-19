import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashToken, issueSession, setAuthCookies } from '@/lib/auth-security'
import type { UserRole } from '@/types'

export async function POST(request: NextRequest) {
  const refresh = request.cookies.get('refresh_token')?.value
  if (!refresh) return NextResponse.json({ success: false }, { status: 401 })
  const h = hashToken(refresh)
  const { data: session } = await supabaseAdmin
    .from('auth_sessions')
    .select('user_id, users(role)')
    .eq('refresh_token_hash', h)
    .single()
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  // Supabase returns joined tables as array or object — normalise to single record
  const users = session.users as { role: UserRole } | { role: UserRole }[]
  const role: UserRole = Array.isArray(users) ? users[0].role : users.role
  const ip = request.headers.get('x-forwarded-for') || ''
  const ua = request.headers.get('user-agent') || ''
  const next = await issueSession(session.user_id, role, ip, ua)
  await setAuthCookies(next.access, next.refresh)
  return NextResponse.json({ success: true })
}
