import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { ANALYSIS_STAGES } from '@/constants/demoPersonas'
import { cn } from '@/lib/utils'

interface AnalysisStepProps {
  onComplete: () => void
}

/**
 * Decorative mock analysis animation — not real NLP processing.
 * Stages appear sequentially over ~3–5 seconds with calm transitions.
 */
export function AnalysisStep({ onComplete }: AnalysisStepProps) {
  const [completedStages, setCompletedStages] = useState<number>(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    ANALYSIS_STAGES.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setCompletedStages(index + 1)
          if (index === ANALYSIS_STAGES.length - 1) {
            timers.push(setTimeout(onComplete, 600))
          }
        }, (index + 1) * 600),
      )
    })

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">AI-Assisted Analysis</h2>
      <p className="text-sm text-muted-foreground mb-8">
        Reviewing your narrative for stress and vulnerability indicators. Please wait a moment.
      </p>

      <ul className="space-y-4" aria-live="polite" aria-label="Analysis progress">
        {ANALYSIS_STAGES.map((stage, index) => {
          const isComplete = index < completedStages
          const isActive = index === completedStages
          return (
            <li
              key={stage}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-4 transition-colors',
                isComplete && 'border-accent/30 bg-accent/5',
                isActive && 'border-primary/30 bg-primary/5',
                !isComplete && !isActive && 'border-border',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  isComplete && 'bg-accent text-accent-foreground',
                  isActive && 'bg-primary/10 text-primary',
                  !isComplete && !isActive && 'bg-surface-muted text-muted-foreground',
                )}
                aria-hidden="true"
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </span>
              <span className={cn('text-sm', isComplete || isActive ? 'font-medium' : 'text-muted-foreground')}>
                {stage}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
