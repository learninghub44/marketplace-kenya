import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  // Public routes
  const publicRoutes = ['/', '/login', '/register', '/pricing', '/listings']
  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token
  const decoded = verifyToken(token)
  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based routing
  if (path.startsWith('/buyer') && decoded.role !== 'buyer') {
    return NextResponse.redirect(new URL(`/${decoded.role}`, request.url))
  }

  if (path.startsWith('/seller') && decoded.role !== 'seller') {
    return NextResponse.redirect(new URL(`/${decoded.role}`, request.url))
  }

  if (path.startsWith('/admin') && decoded.role !== 'admin') {
    return NextResponse.redirect(new URL(`/${decoded.role}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
