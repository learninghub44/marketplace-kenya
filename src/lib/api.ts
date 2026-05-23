const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya.onrender.com'

// Retry fetch with exponential backoff — handles Render cold starts
export async function apiFetch(path: string, options?: RequestInit, retries = 3): Promise<any> {
  const url = `${API_BASE}${path}`
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000), // 15s timeout per attempt
      })
      // If server responded (even with error status), return it
      return res
    } catch (err: any) {
      const isLastAttempt = attempt === retries
      const isNetworkError = err.name === 'TypeError' || err.name === 'AbortError'
      if (isLastAttempt || !isNetworkError) throw err
      // Wait before retry: 2s, 4s
      await new Promise(r => setTimeout(r, attempt * 2000))
    }
  }
}

export { API_BASE }
