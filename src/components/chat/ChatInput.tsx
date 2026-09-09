import { type KeyboardEvent, useEffect, useRef } from 'react'
import { SendHorizontal } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { cn } from '@/lib/utils'

export function ChatInput() {
  const currentInput = useChatStore((state) => state.currentInput)
  const setCurrentInput = useChatStore((state) => state.setCurrentInput)
  const sendMessage = useChatStore((state) => state.sendMessage)
  const isTyping = useChatStore((state) => state.isTyping)
  const isOpen = useChatStore((state) => state.isOpen)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus on desktop when chat opens
  useEffect(() => {
    if (isOpen && window.innerWidth >= 768) {
      textareaRef.current?.focus()
    }
  }, [isOpen])

  // Auto-adjust textarea height up to a max
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }, [currentInput])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (currentInput.trim() && !isTyping) {
        sendMessage()
      }
    }
  }

  const handleSend = () => {
    if (currentInput.trim() && !isTyping) {
      sendMessage()
    }
  }

  const canSend = currentInput.trim().length > 0 && !isTyping

  return (
    <div className="border-t border-border/70 bg-surface/90 p-3 backdrop-blur-md">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-end gap-2"
      >
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isTyping}
            className="w-full resize-none rounded-xl border border-border/80 bg-surface-muted/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all max-h-[120px] min-h-[42px]"
            aria-label="Message input"
          />
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className={cn(
            'flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            canSend
              ? 'hover:bg-primary/90 hover:scale-105 active:scale-95 cursor-pointer'
              : 'opacity-40 cursor-not-allowed',
          )}
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
