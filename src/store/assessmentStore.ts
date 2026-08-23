import { create } from 'zustand'
import type {
  Assessment,
  AssessmentContext,
  AssessmentResult,
  AssessmentStep,
  ConsentState,
  InteractionChannel,
  RiskCategory,
} from '@/types'

const defaultContext: AssessmentContext = {
  preferredLanguage: 'en',
  incidentCategory: '',
  immediateDanger: false,
  safeTime: '',
  safeContact: '',
}

interface AssessmentStore {
  step: AssessmentStep
  consent: ConsentState
  context: AssessmentContext
  narrative: string
  channel: InteractionChannel
  result: AssessmentResult | null
  assessmentId: string | null
  demoPersonaId: RiskCategory | null
  escalatedCaseId: string | null
  setStep: (step: AssessmentStep) => void
  setConsent: (consent: Partial<ConsentState>) => void
  setContext: (context: Partial<AssessmentContext>) => void
  setNarrative: (narrative: string) => void
  setChannel: (channel: InteractionChannel) => void
  setResult: (result: AssessmentResult | null) => void
  setDemoPersona: (persona: RiskCategory | null) => void
  setEscalatedCaseId: (caseId: string) => void
  resetAssessment: () => void
  getAssessmentSnapshot: () => Assessment
}

const createAssessmentId = () =>
  `ASMT-${Date.now().toString(36).toUpperCase()}`

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  step: 'context',
  consent: {
    purposeUnderstood: false,
    voluntaryConsent: false,
    notDiagnosis: false,
  },
  context: { ...defaultContext },
  narrative: '',
  channel: 'text',
  result: null,
  assessmentId: null,
  demoPersonaId: null,
  escalatedCaseId: null,

  setStep: (step) => set({ step }),

  setConsent: (consent) =>
    set((state) => ({ consent: { ...state.consent, ...consent } })),

  setContext: (context) =>
    set((state) => ({ context: { ...state.context, ...context } })),

  setNarrative: (narrative) => set({ narrative }),

  setChannel: (channel) => set({ channel }),

  setResult: (result) => set({ result }),

  setDemoPersona: (persona) => set({ demoPersonaId: persona }),

  setEscalatedCaseId: (caseId) => set({ escalatedCaseId: caseId }),

  resetAssessment: () =>
    set({
      step: 'context',
      context: { ...defaultContext },
      narrative: '',
      channel: 'text',
      result: null,
      assessmentId: createAssessmentId(),
      demoPersonaId: null,
      escalatedCaseId: null,
    }),

  getAssessmentSnapshot: () => {
    const state = get()
    return {
      id: state.assessmentId ?? createAssessmentId(),
      context: state.context,
      narrative: state.narrative,
      channel: state.channel,
      result: state.result,
      consentGiven: Object.values(state.consent).every(Boolean),
      createdAt: new Date().toISOString(),
      demoPersonaId: state.demoPersonaId ?? undefined,
    }
  },
}))

// State resets on full page reload — intentional for demo prototype (no persistence).
