import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwtEdge } from '@/lib/edge-auth'

const publicRoutes = ['/', '/login', '/register', '/pricing', '/listings', '/support', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Allow public routes and static assets
  if (publicRoutes.some(r => path === r || path.startsWith(r + '/')) || path.startsWith('/_next') || path.startsWith('/api')) return res

  const token = request.cookies.get('token')?.value
  if (!token) return res // Let client-side auth handle redirects for protected pages

  const decoded: any = await verifyJwtEdge(token)
  if (!decoded) return res

  if (path.startsWith('/buyer') && decoded.role !== 'buyer') return NextResponse.redirect(new URL(`/${decoded.role}`, request.url))
  if (path.startsWith('/seller') && decoded.role !== 'seller') return NextResponse.redirect(new URL(`/${decoded.role}`, request.url))
  if (path.startsWith('/admin') && decoded.role !== 'admin') return NextResponse.redirect(new URL(`/${decoded.role}`, request.url))

  return res
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
