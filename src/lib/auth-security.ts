import jwt from 'jsonwebtoken'
import type { UserRole } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export function verifyJWT(token: string): { userId: string; role: UserRole } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: UserRole }
  } catch { return null }
}

export function generateJWT(userId: string, role: UserRole): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
}
