import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC = ['/', '/listings', '/sign-in', '/sign-up', '/pricing', '/support',
  '/terms', '/privacy', '/auth/callback', '/onboarding', '/forgot-password', '/reset-password']

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const path = req.nextUrl.pathname
  const isPublic = PUBLIC.some(p => path === p || path.startsWith(p + '/'))
    || path.startsWith('/_next') || path.startsWith('/api/auth')
    || path.startsWith('/api/listings') || path.startsWith('/api/categories')
    || /\.(png|jpg|svg|ico|css|js|woff|woff2)$/.test(path)
  if (isPublic) return NextResponse.next()
  const { userId } = await auth()
  if (!userId) {
    const url = new URL('/sign-in', req.url)
    url.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
