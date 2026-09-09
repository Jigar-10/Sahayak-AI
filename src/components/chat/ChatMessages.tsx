import { useEffect, useRef } from 'react'
import { useChatStore } from '@/store/chatStore'
import { ChatMessageItem } from './ChatMessageItem'
import { TypingIndicator } from './TypingIndicator'

export function ChatMessages() {
  const messages = useChatStore((state) => state.messages)
  const isTyping = useChatStore((state) => state.isTyping)
  const sendSuggestion = useChatStore((state) => state.sendSuggestion)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Smooth scroll to bottom whenever messages change or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.map((message) => {
        const hasSuggestions = message.suggestions && message.suggestions.length > 0
        return (
          <div key={message.id} className="space-y-2.5">
            <ChatMessageItem message={message} />

            {/* Quick Action Suggestion Chips for assistant messages */}
            {hasSuggestions && (
              <div className="ml-9 flex flex-wrap gap-1.5 pt-1 animate-enter">
                {message.suggestions?.map((suggestion, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    disabled={isTyping}
                    onClick={() => sendSuggestion(suggestion)}
                    className="inline-flex items-center rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition-all duration-150 hover:bg-primary/15 hover:border-primary/40 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator />}

      {/* Invisible anchor for auto-scroll */}
      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  )
}
