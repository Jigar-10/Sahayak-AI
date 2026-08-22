import { AlertTriangle, ShieldAlert, TrendingUp, Activity } from 'lucide-react'
import { getRiskColorClass, getRiskLabel } from '@/constants/sviThresholds'
import { SVI_THRESHOLDS } from '@/constants/sviThresholds'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { AssessmentResult } from '@/types'

interface SVIGaugeProps {
  result: AssessmentResult
}

const RISK_ICONS = {
  low: ShieldAlert,
  moderate: Activity,
  high: TrendingUp,
  critical: AlertTriangle,
}

export function SVIGauge({ result }: SVIGaugeProps) {
  const { svi, riskCategory } = result
  const label = getRiskLabel(riskCategory)
  const colorClass = getRiskColorClass(riskCategory)
  const RiskIcon = RISK_ICONS[riskCategory]

  const rotation = (svi / 100) * 180 - 90

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-48 h-24 overflow-hidden mb-2"
        role="img"
        aria-label={`Stress Vulnerability Index: ${svi} out of 100, ${label} risk`}
      >
        <div className="absolute inset-0 rounded-t-full border-[12px] border-surface-muted" />
        <div
          className="absolute inset-0 rounded-t-full border-[12px] border-transparent"
          style={{
            borderTopColor: 'var(--color-primary)',
            borderRightColor: svi > 33 ? 'var(--color-warning-moderate)' : 'transparent',
            borderLeftColor: 'var(--color-accent)',
            clipPath: 'inset(0 0 50% 0)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-1/2 origin-bottom w-1 h-20 bg-primary rounded-full transition-transform duration-700"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          aria-hidden="true"
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-4xl font-bold text-foreground">{svi}</span>
          <span className="text-sm text-muted-foreground block">/ 100</span>
        </div>
      </div>

      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium',
          colorClass,
        )}
      >
        <RiskIcon className="h-4 w-4" aria-hidden="true" />
        <span>{label} Risk</span>
      </div>

      <p className="sr-only">
        Thresholds: Low {SVI_THRESHOLDS.low.min}–{SVI_THRESHOLDS.low.max}, Moderate{' '}
        {SVI_THRESHOLDS.moderate.min}–{SVI_THRESHOLDS.moderate.max}, High{' '}
        {SVI_THRESHOLDS.high.min}–{SVI_THRESHOLDS.high.max}, Critical{' '}
        {SVI_THRESHOLDS.critical.min}–{SVI_THRESHOLDS.critical.max}
      </p>
    </div>
  )
}

interface IndicatorListProps {
  indicators: AssessmentResult['indicators']
}

export function IndicatorList({ indicators }: IndicatorListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {indicators.map((indicator) => (
        <Card key={indicator.id}>
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{indicator.label}</span>
              <span className="text-sm text-muted-foreground">{indicator.value}%</span>
            </div>
            <Progress value={indicator.value} aria-label={`${indicator.label}: ${indicator.value} percent`} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
