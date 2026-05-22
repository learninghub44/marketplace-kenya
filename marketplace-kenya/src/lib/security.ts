import crypto from 'crypto'

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export function validateIP(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipRegex.test(ip)
}

export function detectSuspiciousActivity(activity: any): {
  isSuspicious: boolean
  reasons: string[]
  severity: 'low' | 'medium' | 'high'
} {
  const reasons: string[] = []
  let severity: 'low' | 'medium' | 'high' = 'low'

  // Check for rapid successive requests
  if (activity.requestCount > 100) {
    reasons.push('Excessive request rate')
    severity = 'high'
  }

  // Check for multiple failed login attempts
  if (activity.failedLogins > 5) {
    reasons.push('Multiple failed login attempts')
    severity = 'high'
  }

  // Check for suspicious user agent
  if (activity.userAgent?.includes('bot') || activity.userAgent?.includes('crawler')) {
    reasons.push('Suspicious user agent')
    severity = 'medium'
  }

  // Check for unusual location
  if (activity.unusualLocation) {
    reasons.push('Unusual location')
    severity = 'medium'
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons,
    severity,
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  // Kenyan phone number format: +254 7XX XXX XXX or 07XX XXX XXX
  const phoneRegex = /^(\+254|0)7[0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

export function decryptData(encryptedData: string, key: string): string {
  const parts = encryptedData.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const encrypted = parts[1]
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
