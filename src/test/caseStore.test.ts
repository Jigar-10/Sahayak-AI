import { describe, expect, it, beforeEach } from 'vitest'
import { useCaseStore } from '@/store/caseStore'
import type { Assessment } from '@/types'

describe('caseStore', () => {
  beforeEach(() => {
    useCaseStore.setState({ cases: [], nextCaseNumber: 127 })
  })

  it('creates a case with sequential ID from escalated assessment', async () => {
    const assessment: Assessment = {
      id: 'ASMT-TEST',
      context: {
        preferredLanguage: 'en',
        incidentCategory: 'other',
        immediateDanger: false,
      },
      narrative: 'Test narrative',
      channel: 'text',
      result: {
        svi: 91,
        riskCategory: 'critical',
        indicators: [],
        explainableIndicators: ['test'],
        aiConfidence: 84,
      },
      consentGiven: true,
      createdAt: new Date().toISOString(),
    }

    const created = await useCaseStore.getState().createCaseFromAssessment(assessment)

    expect(created.id).toBe('CASE-2026-00127')
    expect(created.svi).toBe(91)
    expect(created.riskCategory).toBe('critical')
    expect(useCaseStore.getState().cases).toHaveLength(1)
    expect(useCaseStore.getState().getCaseById('CASE-2026-00127')).toEqual(created)
  })
})
