import { useEffect, useRef } from 'react'
import { useChatStore } from '@/store/chatStore'
import { ChatHeader } from './ChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { ChatFloatingButton } from './ChatFloatingButton'
import { cn } from '@/lib/utils'

export function ChatBox() {
  const isOpen = useChatStore((state) => state.isOpen)
  const closeChat = useChatStore((state) => state.closeChat)
  const windowRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeChat])

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col items-end',
        // Desktop spacing: 24px (bottom-6 right-6)
        // Mobile spacing: 16px (bottom-4 right-4)
        'bottom-4 right-4 sm:bottom-6 sm:right-6',
      )}
    >
      {/* Open Chat Window */}
      {isOpen && (
        <div
          ref={windowRef}
          id="emotrace-chatbox-window"
          role="dialog"
          aria-label="EmoTrace AI Chat Assistant"
          className={cn(
            'mb-3 flex flex-col overflow-hidden border bg-surface/95 backdrop-blur-xl transition-all duration-300',
            // Border & Corners: 20-22px
            'rounded-[22px] border-border/80 shadow-[0_20px_50px_rgba(15,118,110,0.18)]',
            // Dimensions:
            // Desktop: ~380px wide, ~560px tall
            // Mobile: nearly full width with safe margin, dynamic height
            'w-[calc(100vw-32px)] max-w-[390px]',
            'h-[min(560px,calc(100vh-100px))]',
            // Animations
            'animate-chat-enter',
          )}
        >
          {/* Fixed Header */}
          <ChatHeader onClose={closeChat} />

          {/* Scrollable Messages Area */}
          <ChatMessages />

          {/* Bottom Input Area */}
          <ChatInput />
        </div>
      )}

      {/* Floating Action Button (Always anchored in bottom-right) */}
      <ChatFloatingButton />
    </div>
  )
}
