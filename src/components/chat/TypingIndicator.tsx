import { Sparkles } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div
      className="flex items-end gap-2.5 animate-enter"
      role="status"
      aria-label="Sahayak AI is typing"
    >
      {/* AI Avatar */}
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-teal-600 text-white shadow-sm"
        aria-hidden="true"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      {/* Typing dots container */}
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-xs border border-border/80 bg-surface px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <span
          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '900ms' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
          style={{ animationDelay: '200ms', animationDuration: '900ms' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
          style={{ animationDelay: '400ms', animationDuration: '900ms' }}
        />
        <span className="sr-only">Sahayak AI is thinking...</span>
      </div>
    </div>
  )
}
