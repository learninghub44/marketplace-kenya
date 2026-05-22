import { cookies, headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabaseAdmin, supabase } from './supabase'
import crypto from 'crypto'
import type { UserRole } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const ACCESS_TTL = 60 * 15
const REFRESH_DAYS = 30

export function signAccessToken(payload: { userId: string; role: UserRole; sid: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL })
}

export function verifyAccessToken(token: string) {
  try { return jwt.verify(token, JWT_SECRET) as any } catch { return null }
}

export function generateRefreshToken() { return crypto.randomBytes(48).toString('hex') }
export function hashToken(token: string) { return crypto.createHash('sha256').update(token).digest('hex') }

export async function issueSession(userId: string, role: UserRole, ip?: string, ua?: string) {
  const refresh = generateRefreshToken()
  const refreshHash = hashToken(refresh)
  const expiresAt = new Date(Date.now() + REFRESH_DAYS * 86400000).toISOString()
  const { data: session } = await supabaseAdmin.from('auth_sessions').insert({
    user_id: userId, refresh_token_hash: refreshHash, expires_at: expiresAt, ip_address: ip, user_agent: ua
  }).select().single()

  const access = signAccessToken({ userId, role, sid: session.id })
  return { access, refresh, sid: session.id, expiresAt }
}

export async function setAuthCookies(access: string, refresh: string) {
  const c = await cookies()
  c.set('token', access, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: ACCESS_TTL })
  c.set('refresh_token', refresh, { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: REFRESH_DAYS * 86400 })
}

export async function clearAuthCookies() {
  const c = await cookies(); c.delete('token'); c.delete('refresh_token')
}

export async function logSecurity(eventType: string, description: string, userId?: string, severity: 'low'|'medium'|'high'|'critical'='low', metadata?: any) {
  const h = await headers()
  await supabaseAdmin.from('security_logs').insert({
    user_id: userId || null,
    event_type: eventType,
    description,
    severity,
    ip_address: h.get('x-forwarded-for') || '',
    user_agent: h.get('user-agent') || '',
    metadata: metadata || {},
    tenant_id: metadata?.tenant_id || '00000000-0000-0000-0000-000000000000'
  })
}

export async function getOAuthUrl(provider: 'google'|'apple', redirectTo: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
  if (error) throw error
  return data.url
}
