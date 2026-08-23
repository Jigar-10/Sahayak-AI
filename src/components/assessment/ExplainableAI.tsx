import { Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AssessmentResult } from '@/types'

export function ExplainableAI({ result }: { result: AssessmentResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="h-5 w-5 text-primary" aria-hidden="true" />
          Why This Assessment Was Generated
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm text-muted-foreground">
          {result.explainableIndicators.map((indicator) => (
            <li key={indicator} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>{indicator}</span>
            </li>
          ))}
        </ul>
        <p className="rounded-md bg-surface-muted p-3 text-sm text-muted-foreground">
          AI confidence: <span className="font-semibold text-foreground">{result.aiConfidence}%</span>.
          This reflects confidence in the mock classification, not certainty about the person's
          mental state.
        </p>
      </CardContent>
    </Card>
  )
}
