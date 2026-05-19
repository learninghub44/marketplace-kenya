import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/lib/auth-security'

const publicRoutes = ['/', '/login', '/register', '/pricing', '/listings']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  if (publicRoutes.includes(path) || path.startsWith('/api/auth')) return res

  const token = request.cookies.get('token')?.value
  if (!token) return NextResponse.redirect(new URL('/login', request.url))

  const decoded: any = verifyAccessToken(token)
  if (!decoded) return NextResponse.redirect(new URL('/login', request.url))

  if (path.startsWith('/buyer') && decoded.role !== 'buyer') return NextResponse.redirect(new URL(`/${decoded.role}`, request.url))
  if (path.startsWith('/seller') && decoded.role !== 'seller') return NextResponse.redirect(new URL(`/${decoded.role}`, request.url))
  if (path.startsWith('/admin') && decoded.role !== 'admin') return NextResponse.redirect(new URL(`/${decoded.role}`, request.url))

  return res
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
