import type { CaseRecord, RiskCategory } from '@/types'

export interface CaseKPIs {
  totalActive: number
  critical: number
  highRisk: number
  pendingCounselling: number
  pendingLegalAid: number
  emergencyEscalations: number
}

export function computeCaseKPIs(cases: CaseRecord[]): CaseKPIs {
  const active = cases.filter((c) => c.status !== 'closed')

  return {
    totalActive: active.length,
    critical: active.filter((c) => c.riskCategory === 'critical').length,
    highRisk: active.filter((c) => c.riskCategory === 'high').length,
    pendingCounselling: active.filter(
      (c) =>
        !c.assignedOfficer?.toLowerCase().includes('counsellor') &&
        ['moderate', 'high', 'critical'].includes(c.riskCategory),
    ).length,
    pendingLegalAid: active.filter(
      (c) =>
        ['high', 'critical'].includes(c.riskCategory) &&
        !c.assignedOfficer?.toLowerCase().includes('legal'),
    ).length,
    emergencyEscalations: active.filter((c) => c.escalated).length,
  }
}

export function getRiskDistribution(cases: CaseRecord[]) {
  const categories: RiskCategory[] = ['low', 'moderate', 'high', 'critical']
  return categories.map((category) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: cases.filter((c) => c.riskCategory === category && c.status !== 'closed').length,
    category,
  }))
}

export function getCasesOverTime(cases: CaseRecord[]) {
  const buckets = new Map<string, number>()
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    buckets.set(key, 0)
  }

  cases.forEach((c) => {
    const key = new Date(c.createdAt).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    })
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }
  })

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }))
}

export function getSupportAllocation(cases: CaseRecord[]) {
  const counts: Record<string, number> = {
    counselling: 0,
    legal: 0,
    medical: 0,
    police: 0,
    witness: 0,
  }

  cases
    .filter((c) => c.status !== 'closed')
    .forEach((c) => {
      c.recommendedActions.forEach((action) => {
        if (action in counts) counts[action]++
      })
    })

  return Object.entries(counts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))
}

export const RISK_CHART_COLORS: Record<RiskCategory, string> = {
  low: '#2d8a7e',
  moderate: '#d97706',
  high: '#ea580c',
  critical: '#dc2626',
}
