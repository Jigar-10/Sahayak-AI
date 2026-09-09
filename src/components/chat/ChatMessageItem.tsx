import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import type { ChatMessage } from '@/types/chat'
import { useChatStore } from '@/store/chatStore'
import { cn } from '@/lib/utils'

interface ChatMessageItemProps {
  message: ChatMessage
}

/**
 * Lightweight formatting helper for text that parses **bold** and bullet points cleanly
 * without needing external markdown libraries.
 */
function FormattedContent({ content }: { content: string }) {
  const paragraphs = content.split('\n\n')

  return (
    <div className="space-y-2 leading-relaxed text-sm">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n')
        const isBulletList = lines.every(
          (line) => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim() === '',
        )

        if (isBulletList) {
          return (
            <ul key={pIdx} className="space-y-1.5 pl-1">
              {lines
                .filter((l) => l.trim().length > 0)
                .map((line, lIdx) => {
                  const cleanText = line.replace(/^[•-]\s*/, '')
                  return (
                    <li key={lIdx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{renderBoldSpans(cleanText)}</span>
                    </li>
                  )
                })}
            </ul>
          )
        }

        return (
          <p key={pIdx}>
            {lines.map((line, lIdx) => (
              <span key={lIdx}>
                {renderBoldSpans(line)}
                {lIdx < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

function renderBoldSpans(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const retryLastMessage = useChatStore((state) => state.retryLastMessage)
  const isUser = message.role === 'user'
  const isError = message.status === 'error'

  if (isUser) {
    return (
      <div className="flex flex-col items-end animate-enter">
        <div className="max-w-[84%] rounded-2xl rounded-br-xs bg-primary px-4 py-2.5 text-primary-foreground shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="mt-1 text-[11px] font-medium text-muted-foreground/80 px-1">
          {message.timestamp}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2.5 animate-enter">
      {/* AI Avatar */}
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-teal-600 text-white shadow-sm"
        aria-hidden="true"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="flex max-w-[88%] flex-col items-start">
        <div
          className={cn(
            'rounded-2xl rounded-bl-xs border px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
            isError
              ? 'border-critical/30 bg-critical/5 text-critical'
              : 'border-border/80 bg-surface text-foreground',
          )}
        >
          {isError ? (
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-critical" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-critical">{message.content}</p>
                <button
                  type="button"
                  onClick={() => retryLastMessage()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-critical/30 bg-surface px-2.5 py-1 text-xs font-semibold text-critical hover:bg-critical/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-critical transition-colors"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <FormattedContent content={message.content} />
          )}

          {/* Action Link (if provided) */}
          {message.actionLink && (
            <div className="mt-3 pt-2 border-t border-border/50">
              <Link
                to={message.actionLink.to}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              >
                <span>{message.actionLink.label}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>

        <span className="mt-1 text-[11px] font-medium text-muted-foreground/80 px-1">
          {message.timestamp}
        </span>
      </div>
    </div>
  )
}
