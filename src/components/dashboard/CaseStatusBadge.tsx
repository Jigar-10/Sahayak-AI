import { AlertTriangle, CheckCircle2, Clock, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRiskLabel } from '@/constants/sviThresholds'
import type { CaseStatus, RiskCategory } from '@/types'

const riskStyles: Record<RiskCategory, string> = {
  low: 'border-accent/30 bg-accent/10 text-accent',
  moderate: 'border-amber-200 bg-amber-50 text-warning-moderate',
  high: 'border-orange-200 bg-orange-50 text-warning-high',
  critical: 'border-red-200 bg-red-50 text-critical',
}

const statusLabels: Record<CaseStatus, string> = {
  open: 'Open',
  assigned: 'Assigned',
  'in-review': 'In Review',
  closed: 'Closed',
}

const statusStyles: Record<CaseStatus, string> = {
  open: 'border-border bg-surface-muted text-foreground',
  assigned: 'border-primary/20 bg-primary/10 text-primary',
  'in-review': 'border-amber-200 bg-amber-50 text-warning-moderate',
  closed: 'border-accent/30 bg-accent/10 text-accent',
}

export function RiskBadge({ risk }: { risk: RiskCategory }) {
  const Icon = risk === 'critical' ? AlertTriangle : CheckCircle2

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium',
        riskStyles[risk],
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {getRiskLabel(risk)}
    </span>
  )
}

export function StatusBadge({ status }: { status: CaseStatus }) {
  const Icon = status === 'assigned' ? UserCheck : Clock

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium',
        statusStyles[status],
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  )
}
