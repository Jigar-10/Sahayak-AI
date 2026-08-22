import type { DemoPersona, RiskCategory } from '@/types'

export const DEMO_PERSONAS: Record<
  RiskCategory,
  DemoPersona & { narrative: string }
> = {
  low: {
    id: 'low',
    label: 'Low Risk',
    svi: 22,
    riskCategory: 'low',
    aiConfidence: 78,
    narrative:
      'I have been feeling uneasy after a recent incident at my workplace. There were some comments that made me uncomfortable, but I am safe at home now and have support from friends.',
    indicators: [
      { id: 'fear-anxiety', label: 'Fear / Anxiety', value: 18 },
      { id: 'trauma', label: 'Trauma Indicators', value: 15 },
      { id: 'threat', label: 'Threat Perception', value: 12 },
      { id: 'sleep', label: 'Sleep Disturbance', value: 20 },
      { id: 'isolation', label: 'Social Isolation', value: 14 },
      { id: 'hypervigilance', label: 'Hypervigilance', value: 16 },
    ],
    explainableIndicators: [
      'Mild stress-related language detected',
      'No immediate danger signals identified',
      'Stable support network mentioned',
    ],
  },
  moderate: {
    id: 'moderate',
    label: 'Moderate Risk',
    svi: 43,
    riskCategory: 'moderate',
    aiConfidence: 81,
    narrative:
      'Since the incident last month, I have been anxious and find it hard to concentrate. I worry about going back to the same area. I feel nervous when I hear loud voices outside.',
    indicators: [
      { id: 'fear-anxiety', label: 'Fear / Anxiety', value: 45 },
      { id: 'trauma', label: 'Trauma Indicators', value: 38 },
      { id: 'threat', label: 'Threat Perception', value: 42 },
      { id: 'sleep', label: 'Sleep Disturbance', value: 48 },
      { id: 'isolation', label: 'Social Isolation', value: 35 },
      { id: 'hypervigilance', label: 'Hypervigilance', value: 40 },
    ],
    explainableIndicators: [
      'Persistent anxiety-related expressions',
      'Avoidance behavior described',
      'Sleep disturbance indicators present',
    ],
  },
  high: {
    id: 'high',
    label: 'High Risk',
    svi: 68,
    riskCategory: 'high',
    aiConfidence: 86,
    narrative:
      'I am afraid to leave my home. The people who threatened me have been near my neighborhood. I cannot sleep and feel constantly on edge. I have not told many people because I am scared of retaliation.',
    indicators: [
      { id: 'fear-anxiety', label: 'Fear / Anxiety', value: 72 },
      { id: 'trauma', label: 'Trauma Indicators', value: 65 },
      { id: 'threat', label: 'Threat Perception', value: 78 },
      { id: 'sleep', label: 'Sleep Disturbance', value: 70 },
      { id: 'isolation', label: 'Social Isolation', value: 58 },
      { id: 'hypervigilance', label: 'Hypervigilance', value: 74 },
    ],
    explainableIndicators: [
      'Strong fear-related language patterns',
      'Active threat perception described',
      'Significant sleep and hypervigilance indicators',
    ],
  },
  critical: {
    id: 'critical',
    label: 'Critical Risk',
    svi: 91,
    riskCategory: 'critical',
    aiConfidence: 84,
    narrative:
      'They came to my house last night and threatened my family. I believe I am in immediate danger. I cannot stay here safely. I need someone to help me right away before they return.',
    indicators: [
      { id: 'fear-anxiety', label: 'Fear / Anxiety', value: 92 },
      { id: 'trauma', label: 'Trauma Indicators', value: 88 },
      { id: 'threat', label: 'Threat Perception', value: 95 },
      { id: 'sleep', label: 'Sleep Disturbance', value: 85 },
      { id: 'isolation', label: 'Social Isolation', value: 70 },
      { id: 'hypervigilance', label: 'Hypervigilance', value: 90 },
    ],
    explainableIndicators: [
      'Immediate danger language detected',
      'Recent direct threat to safety described',
      'Strong fear-related language with urgency markers',
    ],
  },
}

export const ANALYSIS_STAGES = [
  'Input received',
  'Language identified',
  'Text processed',
  'Emotional indicators analyzed',
  'Vulnerability indicators identified',
  'Risk score generated',
  'Support recommendations prepared',
] as const
