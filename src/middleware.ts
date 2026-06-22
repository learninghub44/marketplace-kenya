import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC = [
  '/', '/listings', '/login', '/register', '/pricing', '/support',
  '/forgot-password', '/reset-password',
]

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isPublic =
    PUBLIC.some(p => path === p || path.startsWith(p + '/')) ||
    path.startsWith('/_next') ||
    path.startsWith('/api/auth') ||
    path.startsWith('/api/listings') ||
    path.startsWith('/api/categories') ||
    /\.(png|jpg|svg|ico|css|js|woff|woff2|pdf)$/.test(path)

  if (isPublic) return NextResponse.next()

  // JWT lives in a cookie (set on login) or Authorization header
  const token =
    req.cookies.get('km_token')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
