import { create } from 'zustand'
import type { Assessment, CaseRecord, TimelineEvent } from '@/types'
import { caseService, type CaseFilterParams } from '@/services/caseService'
import { getRecommendationsForRisk } from '@/constants/recommendations'
import { getRiskLabel } from '@/constants/sviThresholds'

interface CaseStore {
  cases: CaseRecord[]
  isLoading: boolean
  error: string | null
  nextCaseNumber: number

  // Actions
  fetchCases: (filters?: CaseFilterParams) => Promise<void>
  fetchCaseById: (id: string) => Promise<CaseRecord | undefined>
  getCaseById: (id: string) => CaseRecord | undefined
  createCaseFromAssessment: (assessment: Assessment) => Promise<CaseRecord>
  assignCase: (id: string, officer: string) => Promise<void>
  addNote: (id: string, note: string, author?: string) => Promise<void>
  escalateCase: (id: string) => Promise<void>
}

const buildLocalTimeline = (createdAt: string, riskLabel: string): TimelineEvent[] => [
  { id: '1', label: 'Complaint received', timestamp: createdAt },
  { id: '2', label: 'Consent recorded', timestamp: createdAt },
  { id: '3', label: 'AI screening completed', timestamp: createdAt },
  { id: '4', label: `Risk categorized as ${riskLabel}`, timestamp: createdAt },
  { id: '5', label: 'Awaiting case assignment', timestamp: createdAt },
]

export const useCaseStore = create<CaseStore>((set, get) => ({
  cases: [],
  isLoading: false,
  error: null,
  nextCaseNumber: 127,

  fetchCases: async (filters?: CaseFilterParams) => {
    set({ isLoading: true, error: null })
    try {
      const records = await caseService.getCases(filters)
      set({ cases: records, isLoading: false, error: null })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load cases from database'
      set({ isLoading: false, error: message })
    }
  },

  fetchCaseById: async (id: string) => {
    try {
      const record = await caseService.getCaseById(id)
      set((state) => ({
        cases: state.cases.some((c) => c.id === record.id)
          ? state.cases.map((c) => (c.id === record.id ? record : c))
          : [...state.cases, record],
      }))
      return record
    } catch {
      return get().getCaseById(id)
    }
  },

  getCaseById: (id: string) => get().cases.find((c) => c.id === id),

  createCaseFromAssessment: async (assessment: Assessment) => {
    const result = assessment.result!
    const payload: Partial<CaseRecord> = {
      assessmentId: assessment.id,
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
      recommendedActions: getRecommendationsForRisk(result.riskCategory).map((r) => r.id),
      status: 'open',
    }

    try {
      const savedCase = await caseService.createCase(payload)
      set((state) => ({
        cases: [savedCase, ...state.cases],
      }))
      return savedCase
    } catch {
      // Offline fallback if backend server is not running
      const { nextCaseNumber } = get()
      const caseId = `CASE-2026-${String(nextCaseNumber).padStart(5, '0')}`
      const now = new Date().toISOString()
      const timeline = buildLocalTimeline(now, getRiskLabel(result.riskCategory))

      const offlineCase: CaseRecord = {
        id: caseId,
        assessmentId: assessment.id,
        createdAt: now,
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
        recommendedActions: getRecommendationsForRisk(result.riskCategory).map((r) => r.id),
        notes: [],
        escalated:
          result.riskCategory === 'critical' ||
          result.riskCategory === 'high' ||
          assessment.context.immediateDanger,
        timeline,
      }

      set((state) => ({
        cases: [offlineCase, ...state.cases],
        nextCaseNumber: state.nextCaseNumber + 1,
      }))

      return offlineCase
    }
  },

  assignCase: async (id: string, officer: string) => {
    try {
      const updated = await caseService.assignOfficer(id, officer)
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? updated : c)),
      }))
    } catch {
      // Local optimistic update
      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === id
            ? {
                ...c,
                assignedOfficer: officer,
                status: 'assigned',
                timeline: [
                  ...c.timeline,
                  {
                    id: String(c.timeline.length + 1),
                    label: `Case assigned to ${officer}`,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : c,
        ),
      }))
    }
  },

  addNote: async (id: string, note: string, author = 'Demo Reviewer') => {
    try {
      const updated = await caseService.addNote(id, note, author)
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? updated : c)),
      }))
    } catch {
      // Local optimistic update
      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === id
            ? {
                ...c,
                notes: [
                  ...c.notes,
                  {
                    id: String(c.notes.length + 1),
                    author,
                    text: note,
                    timestamp: new Date().toISOString(),
                  },
                ],
                timeline: [
                  ...c.timeline,
                  {
                    id: String(c.timeline.length + 1),
                    label: 'Case note added',
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : c,
        ),
      }))
    }
  },

  escalateCase: async (id: string) => {
    try {
      const updated = await caseService.escalateCase(id)
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? updated : c)),
      }))
    } catch {
      // Local optimistic update
      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === id
            ? {
                ...c,
                escalated: true,
                status: c.status === 'closed' ? 'in-review' : c.status,
                timeline: [
                  ...c.timeline,
                  {
                    id: String(c.timeline.length + 1),
                    label: 'Case escalated for immediate human review',
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : c,
        ),
      }))
    }
  },
}))
