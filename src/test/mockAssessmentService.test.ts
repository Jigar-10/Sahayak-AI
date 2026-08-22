import { describe, expect, it } from 'vitest'
import { getRiskCategoryFromSVI } from '@/constants/sviThresholds'
import { analyzeText } from '@/services/mockAssessmentService'
import { DEMO_PERSONAS } from '@/constants/demoPersonas'

describe('getRiskCategoryFromSVI', () => {
  it('returns low at boundary 24', () => {
    expect(getRiskCategoryFromSVI(24)).toBe('low')
  })

  it('returns moderate at boundary 25', () => {
    expect(getRiskCategoryFromSVI(25)).toBe('moderate')
  })

  it('returns moderate at boundary 49', () => {
    expect(getRiskCategoryFromSVI(49)).toBe('moderate')
  })

  it('returns high at boundary 50', () => {
    expect(getRiskCategoryFromSVI(50)).toBe('high')
  })

  it('returns high at boundary 74', () => {
    expect(getRiskCategoryFromSVI(74)).toBe('high')
  })

  it('returns critical at boundary 75', () => {
    expect(getRiskCategoryFromSVI(75)).toBe('critical')
  })
})

describe('analyzeText', () => {
  const baseContext = {
    preferredLanguage: 'en',
    incidentCategory: 'other',
    immediateDanger: false,
  }

  it('returns fixed demo persona results when forced', () => {
    for (const persona of ['low', 'moderate', 'high', 'critical'] as const) {
      const result = analyzeText({
        narrative: 'anything',
        context: baseContext,
        forcedPersona: persona,
      })
      expect(result.svi).toBe(DEMO_PERSONAS[persona].svi)
      expect(result.riskCategory).toBe(persona)
    }
  })

  it('returns critical when immediate danger is flagged', () => {
    const result = analyzeText({
      narrative: 'short text',
      context: { ...baseContext, immediateDanger: true },
    })
    expect(result.riskCategory).toBe('critical')
    expect(result.svi).toBe(91)
  })
})
