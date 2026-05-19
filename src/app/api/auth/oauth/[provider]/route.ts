import { NextRequest, NextResponse } from 'next/server'
import { getOAuthUrl } from '@/lib/auth-security'

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: 'google'|'apple' }> }) {
  const { provider } = await params
  if (!['google','apple'].includes(provider)) return NextResponse.json({ success:false }, { status: 400 })
  const redirectTo = `${request.nextUrl.origin}/login`
  const url = await getOAuthUrl(provider, redirectTo)
  return NextResponse.redirect(url)
}
