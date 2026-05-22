"use client"
import { useState, useEffect, useRef } from 'react'
import { Loader2, Wifi, WifiOff, RefreshCw, X } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya-1.onrender.com'

type Status = 'idle' | 'waking' | 'online' | 'offline'

interface Props {
  onOnline?: () => void
}

export default function ServerStatus({ onOnline }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [attempts, setAttempts] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    ping()
    return () => { isMounted.current = false }
  }, [])

  const ping = async () => {
    if (!isMounted.current) return
    setStatus('waking')
    for (let i = 1; i <= 10; i++) {
      if (!isMounted.current) return
      setAttempts(i)
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 8000)
        const res = await fetch(`${API_BASE}/api/health`, {
          signal: controller.signal,
          mode: 'cors',
          cache: 'no-store',
        })
        clearTimeout(timer)
        if (res.ok || res.status < 500) {
          if (isMounted.current) { setStatus('online'); onOnline?.() }
          return
        }
      } catch (e) {
        // Ignore — retry
      }
      if (i < 10 && isMounted.current) {
        await new Promise(r => setTimeout(r, 4000))
      }
    }
    if (isMounted.current) setStatus('offline')
  }

  // Don't show anything if online or dismissed
  if (status === 'idle' || dismissed) return null
  if (status === 'online') return null

  return (
    <div className={`rounded-xl p-3 text-sm flex items-start gap-3 border mb-3 ${
      status === 'offline'
        ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400'
        : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300'
    }`}>
      <div className="flex-shrink-0 mt-0.5">
        {status === 'waking' && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'offline' && <WifiOff className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        {status === 'waking' && (
          <>
            <p className="font-semibold text-xs">Server warming up... ({attempts}/10)</p>
            <p className="text-xs mt-0.5 opacity-75">First visit takes ~30s. You can still try logging in.</p>
            <div className="mt-1.5 bg-amber-200/60 dark:bg-amber-800/40 rounded-full h-1 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((attempts / 10) * 100, 95)}%` }} />
            </div>
          </>
        )}
        {status === 'offline' && (
          <>
            <p className="font-semibold text-xs">Server taking longer than usual</p>
            <p className="text-xs mt-0.5 opacity-75">Try logging in anyway — it may still work.</p>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {status === 'offline' && (
          <button onClick={ping} className="text-xs font-bold flex items-center gap-1 opacity-80 hover:opacity-100">
            <RefreshCw className="h-3 w-3" />Retry
          </button>
        )}
        <button onClick={() => setDismissed(true)} className="opacity-50 hover:opacity-100">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
