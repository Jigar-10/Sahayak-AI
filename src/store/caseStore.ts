import { create } from 'zustand'
import type { Assessment, CaseRecord, TimelineEvent } from '@/types'
import { SEED_CASES } from '@/constants/seedCases'
import { getRecommendationsForRisk } from '@/constants/recommendations'
import { getRiskLabel } from '@/constants/sviThresholds'

interface CaseStore {
  cases: CaseRecord[]
  nextCaseNumber: number
  createCaseFromAssessment: (assessment: Assessment) => CaseRecord
  getCaseById: (id: string) => CaseRecord | undefined
  assignCase: (id: string, officer: string) => void
  addNote: (id: string, note: string, author?: string) => void
  escalateCase: (id: string) => void
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
  cases: SEED_CASES,
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
      recommendedActions: getRecommendationsForRisk(result.riskCategory).map(
        (recommendation) => recommendation.id,
      ),
      notes: [],
      escalated:
        result.riskCategory === 'critical' ||
        result.riskCategory === 'high' ||
        assessment.context.immediateDanger,
      timeline,
    }

    set((state) => ({
      cases: [...state.cases, newCase],
      nextCaseNumber: state.nextCaseNumber + 1,
    }))

    return newCase
  },

  getCaseById: (id) => get().cases.find((c) => c.id === id),

  assignCase: (id, officer) =>
    set((state) => ({
      cases: state.cases.map((caseRecord) =>
        caseRecord.id === id
          ? {
              ...caseRecord,
              assignedOfficer: officer,
              status: 'assigned',
              timeline: [
                ...caseRecord.timeline,
                {
                  id: `${caseRecord.timeline.length + 1}`,
                  label: `Case assigned to ${officer}`,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : caseRecord,
      ),
    })),

  addNote: (id, note, author = 'Demo Reviewer') =>
    set((state) => ({
      cases: state.cases.map((caseRecord) =>
        caseRecord.id === id
          ? {
              ...caseRecord,
              notes: [
                ...caseRecord.notes,
                {
                  id: `${caseRecord.notes.length + 1}`,
                  author,
                  text: note,
                  timestamp: new Date().toISOString(),
                },
              ],
              timeline: [
                ...caseRecord.timeline,
                {
                  id: `${caseRecord.timeline.length + 1}`,
                  label: 'Case note added',
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : caseRecord,
      ),
    })),

  escalateCase: (id) =>
    set((state) => ({
      cases: state.cases.map((caseRecord) =>
        caseRecord.id === id
          ? {
              ...caseRecord,
              escalated: true,
              status: caseRecord.status === 'closed' ? 'in-review' : caseRecord.status,
              timeline: [
                ...caseRecord.timeline,
                {
                  id: `${caseRecord.timeline.length + 1}`,
                  label: 'Case escalated for immediate human review',
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : caseRecord,
      ),
    })),
}))

// State resets on full page reload — intentional for demo prototype (no persistence).
