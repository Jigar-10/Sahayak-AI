import { apiClient } from './apiClient'
import type { CaseRecord, EmergencyStatus, LocationStatus } from '@/types'

export interface DeviceLocationResult {
  success: boolean
  latitude?: number
  longitude?: number
  accuracy?: number
  timestamp?: string
  locationStatus: LocationStatus
  errorMessage?: string
}

export interface EmergencyTriggerPayload {
  emergencyType?: string
  latitude?: number
  longitude?: number
  locationAccuracy?: number
  locationTimestamp?: string
  locationStatus?: LocationStatus | string
  notes?: string
  category?: string
  preferredLanguage?: string
  channel?: string
}

export interface EmergencyLocationPayload {
  latitude: number
  longitude: number
  locationAccuracy?: number
  locationTimestamp?: string
  locationStatus?: LocationStatus | string
}

/**
 * Robust device geolocation acquisition using the standard browser Geolocation API.
 * Never uses placeholder or fake coordinates.
 */
export async function getDeviceLocation(): Promise<DeviceLocationResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      locationStatus: 'LOCATION_UNAVAILABLE',
      errorMessage: 'Geolocation is not supported by your browser or device.',
    }
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          timestamp: new Date(position.timestamp).toISOString(),
          locationStatus: 'LOCATION_RECEIVED',
        })
      },
      (error) => {
        let status: LocationStatus = 'LOCATION_UNAVAILABLE'
        let msg = 'Failed to obtain current device position.'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            status = 'LOCATION_DENIED'
            msg = 'Location permission was denied. Please allow location access in your browser for automatic responder dispatch.'
            break
          case error.POSITION_UNAVAILABLE:
            status = 'LOCATION_UNAVAILABLE'
            msg = 'Location signal unavailable. Please ensure GPS/location services are turned on.'
            break
          case error.TIMEOUT:
            status = 'LOCATION_UNAVAILABLE'
            msg = 'Location retrieval timed out. Retrying or sending standard emergency signal.'
            break
        }

        resolve({
          success: false,
          locationStatus: status,
          errorMessage: msg,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    )
  })
}

export const emergencyLocationService = {
  getDeviceLocation,

  /**
   * Trigger an emergency SOS event with real device coordinates.
   */
  triggerEmergency: async (payload: EmergencyTriggerPayload): Promise<CaseRecord> => {
    return apiClient.post<CaseRecord>('/emergency/trigger', payload)
  },

  /**
   * Transmit updated coordinates as user moves.
   */
  updateLocation: async (caseId: string, payload: EmergencyLocationPayload): Promise<CaseRecord> => {
    return apiClient.post<CaseRecord>(`/emergency/${caseId}/location`, payload)
  },

  /**
   * Fetch active emergencies for police/ambulance responders.
   */
  getActiveEmergencies: async (): Promise<CaseRecord[]> => {
    const res = await apiClient.get<CaseRecord[]>('/emergency/active')
    return Array.isArray(res) ? res : []
  },

  /**
   * Update emergency lifecycle state (Dispatch, In Progress, Resolved).
   */
  updateStatus: async (
    caseId: string,
    status: EmergencyStatus | string,
    responderNotes?: string,
  ): Promise<CaseRecord> => {
    return apiClient.patch<CaseRecord>(`/emergency/${caseId}/status`, {
      emergencyStatus: status,
      responderNotes,
    })
  },
}
