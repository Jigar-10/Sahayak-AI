import { apiClient } from './apiClient'
import type { CaseRecord, CaseStatus, InteractionChannel, RiskCategory } from '@/types'

export interface CaseFilterParams {
  risk?: RiskCategory | 'all'
  status?: CaseStatus | 'all'
  channel?: InteractionChannel | 'all'
  page?: number
  size?: number
}

export interface PagedCasesResponse {
  content: CaseRecord[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
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

export const caseService = {
  getCases: async (filters: CaseFilterParams = {}): Promise<CaseRecord[]> => {
    const params = new URLSearchParams()
    if (filters.risk && filters.risk !== 'all') params.set('risk', filters.risk)
    if (filters.status && filters.status !== 'all') params.set('status', filters.status)
    if (filters.channel && filters.channel !== 'all') params.set('channel', filters.channel)
    if (filters.page !== undefined) params.set('page', filters.page.toString())
    if (filters.size !== undefined) params.set('size', filters.size.toString())

    const query = params.toString() ? `?${params.toString()}` : ''
    const res = await apiClient.get<PagedCasesResponse | CaseRecord[]>(`/cases${query}`)

    if (res && 'content' in res && Array.isArray(res.content)) {
      return res.content
    }
    return Array.isArray(res) ? res : []
  },

  getMyCases: async (): Promise<CaseRecord[]> => {
    const res = await apiClient.get<CaseRecord[]>('/cases/my-cases')
    return Array.isArray(res) ? res : []
  },

  getCaseById: async (id: string): Promise<CaseRecord> => {
    return apiClient.get<CaseRecord>(`/cases/${id}`)
  },

  getCaseUpdates: async (id: string): Promise<CaseUpdate[]> => {
    const res = await apiClient.get<CaseUpdate[]>(`/cases/${id}/updates`)
    return Array.isArray(res) ? res : []
  },

  addCaseUpdate: async (id: string, update: Partial<CaseUpdate>): Promise<CaseRecord> => {
    return apiClient.post<CaseRecord>(`/cases/${id}/updates`, update)
  },

  createCase: async (caseData: Partial<CaseRecord>): Promise<CaseRecord> => {
    return apiClient.post<CaseRecord>('/cases', caseData)
  },

  assignOfficer: async (id: string, officer: string): Promise<CaseRecord> => {
    return apiClient.patch<CaseRecord>(`/cases/${id}/assign`, { officer })
  },

  addNote: async (id: string, text: string, author?: string): Promise<CaseRecord> => {
    return apiClient.post<CaseRecord>(`/cases/${id}/notes`, { text, author })
  },

  escalateCase: async (id: string): Promise<CaseRecord> => {
    return apiClient.patch<CaseRecord>(`/cases/${id}/escalate`)
  },

  updateStatus: async (id: string, status: CaseStatus): Promise<CaseRecord> => {
    return apiClient.patch<CaseRecord>(`/cases/${id}/status`, { status })
  },

  getOfficers: async (): Promise<string[]> => {
    return apiClient.get<string[]>('/cases/officers')
  },
}
