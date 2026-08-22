import type { RiskCategory } from '@/types'

export interface RecommendationConfig {
  id: string
  title: string
  description: string
  icon: 'heart' | 'scale' | 'stethoscope' | 'shield' | 'eye'
  priority: 'recommended' | 'urgent' | 'critical'
  minRisk: RiskCategory[]
}

export const RECOMMENDATIONS: RecommendationConfig[] = [
  {
    id: 'counselling',
    title: 'Trauma-Informed Counselling',
    description: 'Connect with a trained counsellor for emotional support and coping strategies.',
    icon: 'heart',
    priority: 'recommended',
    minRisk: ['low', 'moderate', 'high', 'critical'],
  },
  {
    id: 'legal',
    title: 'Legal Aid Support',
    description: 'Access guidance on filing complaints and understanding your legal rights.',
    icon: 'scale',
    priority: 'recommended',
    minRisk: ['moderate', 'high', 'critical'],
  },
  {
    id: 'medical',
    title: 'Medical Support',
    description: 'Arrange medical evaluation for physical or psychological health concerns.',
    icon: 'stethoscope',
    priority: 'recommended',
    minRisk: ['moderate', 'high', 'critical'],
  },
  {
    id: 'police',
    title: 'Police Protection',
    description: 'Request protective measures and formal reporting assistance.',
    icon: 'shield',
    priority: 'urgent',
    minRisk: ['high', 'critical'],
  },
  {
    id: 'witness',
    title: 'Witness Protection',
    description: 'Explore safety planning and witness protection options.',
    icon: 'eye',
    priority: 'critical',
    minRisk: ['critical'],
  },
]

export function getRecommendationsForRisk(risk: RiskCategory) {
  const order: RiskCategory[] = ['low', 'moderate', 'high', 'critical']
  const riskIndex = order.indexOf(risk)
  return RECOMMENDATIONS.filter((rec) =>
    rec.minRisk.some((min) => order.indexOf(min) <= riskIndex),
  ).map((rec) => ({
    ...rec,
    priority:
      risk === 'critical' && rec.id !== 'counselling'
        ? ('critical' as const)
        : risk === 'high' && ['police', 'legal'].includes(rec.id)
          ? ('urgent' as const)
          : rec.priority,
  }))
}
