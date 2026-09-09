import { MessageSquare, Sparkles, X } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { cn } from '@/lib/utils'

export function ChatFloatingButton() {
  const isOpen = useChatStore((state) => state.isOpen)
  const toggleChat = useChatStore((state) => state.toggleChat)
  const unreadCount = useChatStore((state) => state.unreadCount)

  return (
    <div className="relative inline-flex">
      {/* Subtle pulse halo around the button when closed */}
      {!isOpen && (
        <span
          className="absolute -inset-1 rounded-full bg-primary/20 opacity-75 blur-sm animate-pulse motion-reduce:hidden"
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={toggleChat}
        aria-expanded={isOpen}
        aria-controls="sahayak-chatbox-window"
        aria-label={isOpen ? 'Close Sahayak AI chat' : 'Open Sahayak AI chat assistant'}
        className={cn(
          'relative flex items-center justify-center rounded-full text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none cursor-pointer',
          // Sizing: 56px mobile, 60px desktop
          'h-13 w-13 sm:h-15 sm:w-15',
          // Colors & Shadow
          'bg-gradient-to-tr from-primary via-primary to-teal-600',
          'shadow-[0_8px_25px_rgba(15,118,110,0.38)] hover:shadow-[0_12px_32px_rgba(15,118,110,0.48)]',
          'hover:scale-105 active:scale-95',
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-200 rotate-0" aria-hidden="true" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageSquare className="h-6 w-6" aria-hidden="true" />
            <Sparkles className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-amber-200 animate-pulse" aria-hidden="true" />
          </div>
        )}

        {/* Unread indicator badge */}
        {!isOpen && unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-critical px-1 text-[11px] font-bold text-white shadow-md ring-2 ring-surface animate-bounce"
            aria-label={`${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  )
}
