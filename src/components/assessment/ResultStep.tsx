import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmergencyDialog } from '@/components/emergency/EmergencyDialog'
import { ExplainableAI } from '@/components/assessment/ExplainableAI'
import { IndicatorList, SVIGauge } from '@/components/assessment/SVIGauge'
import type { AssessmentResult } from '@/types'

interface ResultStepProps {
  result: AssessmentResult
  onNext: () => void
}

export function ResultStep({ result, onNext }: ResultStepProps) {
  const isCritical = result.riskCategory === 'critical'

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Stress Vulnerability Index Result</h2>
        <p className="text-sm text-muted-foreground">
          This score reflects screening indicators identified in your narrative. It is not a
          diagnosis and does not define your experience.
        </p>
      </div>

      <div className="flex justify-center py-4">
        <SVIGauge result={result} />
      </div>

      {isCritical && (
        <Card className="border-critical/40 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-critical text-base">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Immediate Human Intervention Recommended
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The system identified indicators that may require immediate human support. You are
              not alone. Help is available.
            </p>
            <EmergencyDialog
              trigger={
                <Button variant="destructive">View Emergency Support Options</Button>
              }
            />
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="font-semibold mb-4">Contributing Indicators</h3>
        <IndicatorList indicators={result.indicators} />
      </div>

      <ExplainableAI result={result} />

      <Button onClick={onNext} size="lg">
        View Support Recommendations
      </Button>
    </div>
  )
}
