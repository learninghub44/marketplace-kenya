/**
 * Edge-compatible JWT verification for use in middleware.
 * Uses Web Crypto API instead of Node.js jsonwebtoken/crypto.
 */

function base64UrlDecode(str: string): ArrayBuffer {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer as ArrayBuffer
}

export async function verifyJwtEdge(token: string): Promise<any | null> {
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, signatureB64] = parts
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
    const signature = base64UrlDecode(signatureB64)

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const valid = await crypto.subtle.verify('HMAC', key, signature, data)
    if (!valid) return null

    const payloadBytes = base64UrlDecode(payloadB64)
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes))

    // Check expiry
    if (payload.exp && Date.now() / 1000 > payload.exp) return null

    return payload
  } catch {
    return null
  }
}
