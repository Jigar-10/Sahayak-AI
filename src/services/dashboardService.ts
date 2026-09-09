import { apiClient } from './apiClient'

export interface BackendDashboardStats {
  totalActive: number
  critical: number
  highRisk: number
  pendingCounselling: number
  pendingLegalAid: number
  emergencyEscalations: number
  totalCases: number
  resolvedCases: number
  pendingCases?: number
  underReviewCases?: number
  assignedCases?: number
  rejectedCases?: number
  emergencyNumbersCount?: number
  riskDistribution: Array<{ name: string; value: number; category: string }>
  casesOverTime: Array<{ date: string; count: number }>
  supportAllocation: Array<{ name: string; value: number }>
}

export const dashboardService = {
  getStats: async (): Promise<BackendDashboardStats> => {
    return apiClient.get<BackendDashboardStats>('/dashboard/stats')
  },
}
