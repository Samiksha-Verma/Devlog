'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
    }
    window.addEventListener('devlog-toast', handler)
    return () => window.removeEventListener('devlog-toast', handler)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white min-w-[240px] max-w-sm pointer-events-auto',
            t.type === 'success' && 'bg-emerald-600',
            t.type === 'error' && 'bg-red-600',
            t.type === 'info' && 'bg-indigo-600'
          )}
        >
          {t.type === 'success' && <CheckCircle2 size={16} className="shrink-0" />}
          {t.type === 'error' && <XCircle size={16} className="shrink-0" />}
          {t.type === 'info' && <Info size={16} className="shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button
            className="ml-1 opacity-70 hover:opacity-100"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
