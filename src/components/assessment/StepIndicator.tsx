import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { AssessmentStep } from '@/types'

const STEPS: { id: AssessmentStep; label: string }[] = [
  { id: 'context', label: 'Basic Context' },
  { id: 'narrative', label: 'Narrative' },
  { id: 'analysis', label: 'AI Analysis' },
  { id: 'result', label: 'Result' },
  { id: 'recommendations', label: 'Recommendations' },
]

interface StepIndicatorProps {
  currentStep: AssessmentStep
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep)

  return (
    <nav aria-label="Assessment progress" className="mb-8">
      <ol className="flex flex-wrap gap-2 sm:gap-0 sm:justify-between">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex
          return (
            <li
              key={step.id}
              className={cn(
                'flex items-center gap-2 text-xs sm:text-sm',
                index < STEPS.length - 1 && 'sm:flex-1',
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium',
                  isComplete && 'bg-accent border-accent text-accent-foreground',
                  isCurrent && 'border-primary bg-primary text-primary-foreground',
                  !isComplete && !isCurrent && 'border-border text-muted-foreground',
                )}
                aria-hidden="true"
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden sm:inline font-medium',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <span
                  className="hidden sm:block flex-1 h-0.5 mx-2 bg-border"
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
