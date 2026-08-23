import type { CaseRecord, CaseStatus, InteractionChannel, RiskCategory } from '@/types'
import { DEMO_PERSONAS } from '@/constants/demoPersonas'
import { getRecommendationsForRisk } from '@/constants/recommendations'
import { getRiskLabel } from '@/constants/sviThresholds'

const daysAgo = (days: number, hour = 10): string => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, 30, 0, 0)
  return d.toISOString()
}

function buildSeedCase(
  id: string,
  persona: RiskCategory,
  overrides: Partial<CaseRecord> & {
    createdAt: string
    channel?: InteractionChannel
    assignedOfficer?: string | null
    status?: CaseStatus
    immediateDanger?: boolean
    incidentCategory?: string
  },
): CaseRecord {
  const p = DEMO_PERSONAS[persona]
  const recommendations = getRecommendationsForRisk(persona)

  return {
    id,
    assessmentId: `ASMT-SEED-${id.slice(-3)}`,
    createdAt: overrides.createdAt,
    channel: overrides.channel ?? 'text',
    language: 'en',
    svi: p.svi,
    riskCategory: persona,
    immediateDanger: overrides.immediateDanger ?? persona === 'critical',
    indicators: p.indicators,
    explainableIndicators: p.explainableIndicators,
    aiConfidence: p.aiConfidence,
    narrative: p.narrative,
    incidentCategory: overrides.incidentCategory ?? 'caste-based-violence',
    assignedOfficer: overrides.assignedOfficer ?? null,
    status: overrides.status ?? 'open',
    recommendedActions: recommendations.map((r) => r.id),
    notes: [],
    escalated: persona === 'critical' || persona === 'high',
    timeline: [
      { id: '1', label: 'Complaint received', timestamp: overrides.createdAt },
      { id: '2', label: 'Consent recorded', timestamp: overrides.createdAt },
      { id: '3', label: 'AI screening completed', timestamp: overrides.createdAt },
      {
        id: '4',
        label: `Risk categorized as ${getRiskLabel(persona)}`,
        timestamp: overrides.createdAt,
      },
      {
        id: '5',
        label: overrides.assignedOfficer
          ? `Case assigned to ${overrides.assignedOfficer}`
          : 'Awaiting case assignment',
        timestamp: overrides.createdAt,
      },
    ],
  }
}

/** Demonstration seed cases — loaded at startup so the dashboard is not empty pre-demo. */
export const SEED_CASES: CaseRecord[] = [
  buildSeedCase('CASE-2026-00122', 'moderate', {
    createdAt: daysAgo(14, 9),
    channel: 'text',
    status: 'assigned',
    assignedOfficer: 'Counsellor Meera Sharma',
    incidentCategory: 'workplace-harassment',
  }),
  buildSeedCase('CASE-2026-00123', 'high', {
    createdAt: daysAgo(7, 14),
    channel: 'voice',
    status: 'in-review',
    assignedOfficer: 'Officer Rajesh Kumar',
    immediateDanger: false,
    incidentCategory: 'community-atrocity',
  }),
  buildSeedCase('CASE-2026-00124', 'critical', {
    createdAt: daysAgo(2, 11),
    channel: 'text',
    status: 'open',
    assignedOfficer: null,
    immediateDanger: true,
    incidentCategory: 'domestic-violence',
  }),
  buildSeedCase('CASE-2026-00125', 'low', {
    createdAt: daysAgo(21, 16),
    channel: 'text',
    status: 'closed',
    assignedOfficer: 'Counsellor Ananya Patel',
    incidentCategory: 'other',
  }),
  buildSeedCase('CASE-2026-00126', 'high', {
    createdAt: daysAgo(4, 8),
    channel: 'voice',
    status: 'assigned',
    assignedOfficer: 'Legal Officer Priya Singh',
    incidentCategory: 'sexual-harassment',
  }),
]

export const MOCK_OFFICERS = [
  'Counsellor Meera Sharma',
  'Counsellor Ananya Patel',
  'Officer Rajesh Kumar',
  'Legal Officer Priya Singh',
  'Protection Officer Vikram Das',
] as const
