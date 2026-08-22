import { DEMO_PERSONAS } from '@/constants/demoPersonas'
import { getDemoNarrative } from '@/services/mockAssessmentService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RiskCategory } from '@/types'

interface DemoModePanelProps {
  onRunDemo: (persona: RiskCategory) => void
}

const DEMO_LEVELS: RiskCategory[] = ['low', 'moderate', 'high', 'critical']

export function DemoModePanel({ onRunDemo }: DemoModePanelProps) {
  if (!import.meta.env.DEV) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-72 shadow-lg border-dashed border-primary/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-primary">Demo Mode (Dev Only)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground mb-3">
          Run reproducible risk scenarios for judge demonstration.
        </p>
        {DEMO_LEVELS.map((level) => (
          <Button
            key={level}
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => onRunDemo(level)}
          >
            Run {DEMO_PERSONAS[level].label} (SVI {DEMO_PERSONAS[level].svi})
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

export { getDemoNarrative }
