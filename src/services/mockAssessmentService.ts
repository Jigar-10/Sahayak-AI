import { DEMO_PERSONAS } from '@/constants/demoPersonas'
import { getRiskCategoryFromSVI } from '@/constants/sviThresholds'
import type { AssessmentContext, AssessmentResult, RiskCategory } from '@/types'

interface AnalyzeInput {
  narrative: string
  context: AssessmentContext
  forcedPersona?: RiskCategory | null
}

/**
 * Mock analysis — decorative/demo only, not real NLP.
 * Returns deterministic results based on demo persona or simple heuristics.
 */
export function analyzeText({
  narrative,
  context,
  forcedPersona,
}: AnalyzeInput): AssessmentResult {
  if (forcedPersona) {
    const persona = DEMO_PERSONAS[forcedPersona]
    return {
      svi: persona.svi,
      riskCategory: persona.riskCategory,
      indicators: persona.indicators,
      explainableIndicators: persona.explainableIndicators,
      aiConfidence: persona.aiConfidence,
    }
  }

  if (context.immediateDanger) {
    return buildFromPersona('critical')
  }

  const text = narrative.toLowerCase()

  const criticalKeywords = ['immediate danger', 'threatened my family', 'help me right away']
  const highKeywords = ['afraid to leave', 'cannot sleep', 'retaliation', 'threatened']
  const moderateKeywords = ['anxious', 'hard to concentrate', 'worried', 'nervous']

  if (criticalKeywords.some((k) => text.includes(k))) {
    return buildFromPersona('critical')
  }
  if (highKeywords.some((k) => text.includes(k))) {
    return buildFromPersona('high')
  }
  if (moderateKeywords.some((k) => text.includes(k))) {
    return buildFromPersona('moderate')
  }

  if (narrative.length > 300) {
    return buildFromPersona('moderate')
  }
  if (narrative.length > 150) {
    return buildFromPersona('low')
  }

  const lengthScore = Math.min(100, Math.round(narrative.length / 5))
  return {
    svi: lengthScore,
    riskCategory: getRiskCategoryFromSVI(lengthScore),
    indicators: DEMO_PERSONAS.low.indicators.map((ind) => ({
      ...ind,
      value: Math.min(100, Math.round(ind.value * (lengthScore / 22))),
    })),
    explainableIndicators: [
      'General stress indicators detected in narrative',
      'No immediate danger language identified',
    ],
    aiConfidence: 72,
  }
}

function buildFromPersona(persona: RiskCategory): AssessmentResult {
  const p = DEMO_PERSONAS[persona]
  return {
    svi: p.svi,
    riskCategory: p.riskCategory,
    indicators: p.indicators,
    explainableIndicators: p.explainableIndicators,
    aiConfidence: p.aiConfidence,
  }
}

export function getDemoNarrative(persona: RiskCategory): string {
  return DEMO_PERSONAS[persona].narrative
}
