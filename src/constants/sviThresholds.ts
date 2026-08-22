import type { RiskCategory } from '@/types'

export const SVI_THRESHOLDS = {
  low: { min: 0, max: 24, label: 'Low' as const },
  moderate: { min: 25, max: 49, label: 'Moderate' as const },
  high: { min: 50, max: 74, label: 'High' as const },
  critical: { min: 75, max: 100, label: 'Critical' as const },
} as const

export function getRiskCategoryFromSVI(svi: number): RiskCategory {
  if (svi <= SVI_THRESHOLDS.low.max) return 'low'
  if (svi <= SVI_THRESHOLDS.moderate.max) return 'moderate'
  if (svi <= SVI_THRESHOLDS.high.max) return 'high'
  return 'critical'
}

export function getRiskLabel(category: RiskCategory): string {
  return SVI_THRESHOLDS[category].label
}

export function getRiskColorClass(category: RiskCategory): string {
  const map: Record<RiskCategory, string> = {
    low: 'text-accent',
    moderate: 'text-warning-moderate',
    high: 'text-warning-high',
    critical: 'text-critical',
  }
  return map[category]
}
