import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase, supabaseAdmin } from './supabase'
import type { User, UserRole } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: string, role: UserRole): string {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function registerUser(
  email: string,
  password: string,
  role: UserRole,
  phone?: string
): Promise<AuthResult> {
  try {
    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return { success: false, error: 'User already exists' }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        role,
        phone,
        email_verified: false,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Create role-specific profile
    if (role === 'buyer') {
      await supabaseAdmin.from('buyers').insert({
        id: user.id,
        tenant_id: user.tenant_id,
      })
    } else if (role === 'seller') {
      await supabaseAdmin.from('sellers').insert({
        id: user.id,
        tenant_id: user.tenant_id,
      })
    } else if (role === 'admin') {
      await supabaseAdmin.from('admins').insert({
        id: user.id,
        tenant_id: user.tenant_id,
        permissions: ['all'],
      })
    }

    // Generate token
    const token = generateToken(user.id, user.role as UserRole)

    return {
      success: true,
      user: user as User,
      token,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Get user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Generate token
    const token = generateToken(user.id, user.role as UserRole)

    return {
      success: true,
      user: user as User,
      token,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return null
    }

    return user as User
  } catch (error) {
    return null
  }
}

export async function verifyEmail(userId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ email_verified: true })
      .eq('id', userId)

    return !error
  } catch (error) {
    return false
  }
}

export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
  try {
    const passwordHash = await hashPassword(newPassword)
    const { error } = await supabaseAdmin
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('email', email)

    return !error
  } catch (error) {
    return false
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    // Integration with Africa's Talking would go here
    console.log(`Sending OTP ${otp} to ${phone}`)
    return true
  } catch (error) {
    return false
  }
}
