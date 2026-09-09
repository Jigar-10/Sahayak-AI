import { apiClient } from './apiClient'

export interface BackendEmergencyNumber {
  id: string
  name: string
  number: string
  description: string
  category: 'Emergency' | 'Women & Child Support' | 'SC/ST Support' | 'Cyber Crime' | string
  state?: string
  available24x7: boolean
  active: boolean
  isPrimary?: boolean
  iconName: string
  availability?: string
}

export const emergencyService = {
  getEmergencyNumbers: async (): Promise<BackendEmergencyNumber[]> => {
    return apiClient.get<BackendEmergencyNumber[]>('/emergency-numbers')
  },

  getById: async (id: string): Promise<BackendEmergencyNumber> => {
    return apiClient.get<BackendEmergencyNumber>(`/emergency-numbers/${id}`)
  },

  create: async (data: Partial<BackendEmergencyNumber>): Promise<BackendEmergencyNumber> => {
    return apiClient.post<BackendEmergencyNumber>('/emergency-numbers', data)
  },

  update: async (id: string, data: Partial<BackendEmergencyNumber>): Promise<BackendEmergencyNumber> => {
    return apiClient.put<BackendEmergencyNumber>(`/emergency-numbers/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/emergency-numbers/${id}`)
  },
}
