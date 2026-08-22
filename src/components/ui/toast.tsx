import { cn } from '@/lib/utils'

type ToastProps = {
  message: string
  visible: boolean
  onClose: () => void
}

export function Toast({ message, visible, onClose }: ToastProps) {
  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-lg border border-border bg-surface px-4 py-3 shadow-lg',
        'animate-in fade-in slide-in-from-bottom-2',
      )}
    >
      <div className="flex items-center gap-3">
        <p className="text-sm">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-primary underline min-h-11 min-w-11"
          aria-label="Dismiss notification"
        >
          OK
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const showToast = (message: string, duration = 4000) => {
    const event = new CustomEvent('app-toast', { detail: { message, duration } })
    window.dispatchEvent(event)
  }
  return { showToast }
}
