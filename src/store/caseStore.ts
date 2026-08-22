import { create } from 'zustand'
import type { Assessment, CaseRecord, TimelineEvent } from '@/types'
import { getRiskLabel } from '@/constants/sviThresholds'

interface CaseStore {
  cases: CaseRecord[]
  nextCaseNumber: number
  createCaseFromAssessment: (assessment: Assessment) => CaseRecord
  getCaseById: (id: string) => CaseRecord | undefined
}

const buildTimeline = (createdAt: string): TimelineEvent[] => [
  {
    id: '1',
    label: 'Complaint received',
    timestamp: createdAt,
  },
  {
    id: '2',
    label: 'Consent recorded',
    timestamp: createdAt,
  },
  {
    id: '3',
    label: 'AI screening completed',
    timestamp: createdAt,
  },
  {
    id: '4',
    label: `Risk categorized as ${getRiskLabel('moderate')}`,
    timestamp: createdAt,
  },
  {
    id: '5',
    label: 'Awaiting case assignment',
    timestamp: createdAt,
  },
]

export const useCaseStore = create<CaseStore>((set, get) => ({
  cases: [],
  nextCaseNumber: 127,

  createCaseFromAssessment: (assessment) => {
    const { nextCaseNumber } = get()
    const caseId = `CASE-2026-${String(nextCaseNumber).padStart(5, '0')}`
    const result = assessment.result!

    const timeline = buildTimeline(new Date().toISOString())
    timeline[3] = {
      ...timeline[3],
      label: `Risk categorized as ${getRiskLabel(result.riskCategory)}`,
    }

    const newCase: CaseRecord = {
      id: caseId,
      assessmentId: assessment.id,
      createdAt: new Date().toISOString(),
      channel: assessment.channel,
      language: assessment.context.preferredLanguage,
      svi: result.svi,
      riskCategory: result.riskCategory,
      immediateDanger: assessment.context.immediateDanger,
      indicators: result.indicators,
      explainableIndicators: result.explainableIndicators,
      aiConfidence: result.aiConfidence,
      narrative: assessment.narrative,
      incidentCategory: assessment.context.incidentCategory,
      assignedOfficer: null,
      status: 'open',
      timeline,
    }

    set((state) => ({
      cases: [...state.cases, newCase],
      nextCaseNumber: state.nextCaseNumber + 1,
    }))

    return newCase
  },

  getCaseById: (id) => get().cases.find((c) => c.id === id),
}))

// State resets on full page reload — intentional for demo prototype (no persistence).
