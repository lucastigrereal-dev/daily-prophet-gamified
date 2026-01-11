'use client'
import { useEffect } from 'react'
import { Toast as ToastType } from '@/hooks/useToast'

interface Props {
  toast: ToastType
  onClose: () => void
}

export default function Toast({ toast, onClose }: Props) {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(onClose, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onClose])

  const styles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    warning: 'bg-yellow-500 border-yellow-600',
    info: 'bg-blue-500 border-blue-600'
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`
      ${styles[toast.type]}
      text-white px-6 py-4 rounded-lg shadow-lg border-l-4
      flex items-center gap-3 min-w-[300px] max-w-[500px]
      animate-slide-in-right
    `}>
      <span className="text-2xl font-bold">{icons[toast.type]}</span>
      <p className="flex-1 font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white text-xl font-bold"
      >
        ×
      </button>
    </div>
  )
}
