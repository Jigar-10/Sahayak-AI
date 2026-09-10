import { Sparkles, Trash2, X } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'

interface ChatHeaderProps {
  onClose: () => void
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  const clearChat = useChatStore((state) => state.clearChat)

  return (
    <div className="flex items-center justify-between border-b border-border/70 bg-surface/90 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-teal-600 text-white shadow-sm">
          <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-bold tracking-tight text-foreground leading-none">
              EmoTrace
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="truncate text-[11px] font-medium text-muted-foreground mt-0.5">
            Safe &amp; confidential support
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button type="button" onClick={clearChat} className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" title="Clear conversation" aria-label="Clear conversation">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" title="Close chat" aria-label="Close chat">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
