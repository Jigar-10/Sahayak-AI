export type RiskCategory = 'low' | 'moderate' | 'high' | 'critical'

export type AssessmentStep =
  | 'context'
  | 'narrative'
  | 'analysis'
  | 'result'
  | 'recommendations'

export type InteractionChannel = 'text' | 'voice' | string

export type CaseStatus = 'open' | 'assigned' | 'in-review' | 'closed'

export interface Indicator {
  id: string
  label: string
  value: number
}

export interface AssessmentContext {
  preferredLanguage: string
  incidentCategory: string
  immediateDanger: boolean
  safeTime?: string
  safeContact?: string
}

export interface AssessmentResult {
  svi: number
  riskCategory: RiskCategory
  indicators: Indicator[]
  explainableIndicators: string[]
  aiConfidence: number
}

export interface Assessment {
  id: string
  context: AssessmentContext
  narrative: string
  channel: InteractionChannel
  result: AssessmentResult | null
  consentGiven: boolean
  createdAt: string
  demoPersonaId?: RiskCategory
}

export interface CaseUpdate {
  id: string
  caseId: string
  status: CaseStatus
  title: string
  message: string
  timestamp: string
  updatedBy: string
  department?: string
}

export type EmergencyStatus =
  | 'EMERGENCY_TRIGGERED'
  | 'LOCATION_RECEIVED'
  | 'RESPONDERS_NOTIFIED'
  | 'IN_PROGRESS'
  | 'RESOLVED'

export type LocationStatus =
  | 'LOCATION_RECEIVED'
  | 'LOCATION_DENIED'
  | 'LOCATION_UNAVAILABLE'
  | 'PENDING'

export interface CaseRecord {
  id: string
  caseNumber?: string
  userId?: string
  title?: string
  category?: string
  description?: string
  priority?: string
  assignedDepartment?: string
  assessmentId: string
  createdAt: string
  updatedAt?: string
  channel: InteractionChannel
  language: string
  svi: number
  riskCategory: RiskCategory
  immediateDanger: boolean
  indicators: Indicator[]
  explainableIndicators: string[]
  aiConfidence: number
  narrative: string
  incidentCategory: string
  assignedOfficer: string | null
  status: CaseStatus
  recommendedActions: string[]
  notes: CaseNote[]
  escalated: boolean
  timeline: TimelineEvent[]
  updates?: CaseUpdate[]

  // Real-time Emergency & Geolocation Location Sharing
  isEmergency?: boolean
  latitude?: number
  longitude?: number
  locationAccuracy?: number
  locationTimestamp?: string
  locationStatus?: LocationStatus | string
  emergencyStatus?: EmergencyStatus | string
  emergencyType?: string
  responderNotes?: string
}

export interface TimelineEvent {
  id: string
  label: string
  timestamp: string
}

export interface CaseNote {
  id: string
  author: string
  text: string
  timestamp: string
}

export interface DemoPersona {
  id: RiskCategory
  label: string
  svi: number
  riskCategory: RiskCategory
  indicators: Indicator[]
  explainableIndicators: string[]
  aiConfidence: number
}

export interface ConsentState {
  purposeUnderstood: boolean
  voluntaryConsent: boolean
  notDiagnosis: boolean
}

export * from './chat'

