import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { issueSession, setAuthCookies, logSecurity } from '@/lib/auth-security'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })

    const result = await loginUser(email, password)
    if (!result.success || !result.user) {
      await logSecurity('failed_login', `Failed login for ${email}`, undefined, 'medium')
      return NextResponse.json(result, { status: 401 })
    }

    const ip = request.headers.get('x-forwarded-for') || ''
    const ua = request.headers.get('user-agent') || ''
    const sess = await issueSession(result.user.id, result.user.role, ip, ua)
    await setAuthCookies(sess.access, sess.refresh)
    await logSecurity('successful_login', 'User login success', result.user.id, result.user.role === 'admin' ? 'medium' : 'low')

    return NextResponse.json({ success: true, user: result.user })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
