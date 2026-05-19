import { NextRequest, NextResponse } from 'next/server'
import { getOAuthUrl } from '@/lib/auth-security'

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params

  if (provider !== 'google' && provider !== 'apple') {
    return NextResponse.json({ success: false, error: 'Unsupported OAuth provider' }, { status: 400 })
  }

  const redirectTo = `${request.nextUrl.origin}/login`
  const url = await getOAuthUrl(provider, redirectTo)
  return NextResponse.redirect(url)
}
