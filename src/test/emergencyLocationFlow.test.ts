import { describe, it, expect, vi, beforeEach } from 'vitest'
import { emergencyLocationService, getDeviceLocation } from '@/services/emergencyLocationService'
import { apiClient } from '@/services/apiClient'

vi.mock('@/services/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('Emergency Location & Automatic Sharing Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('triggers emergency SOS and submits GPS coordinates to backend', async () => {
    const mockCaseResponse = {
      id: 'EMG-2026-00101',
      caseNumber: 'EMG-2026-00101',
      isEmergency: true,
      emergencyType: 'SOS_PANIC',
      latitude: 19.076,
      longitude: 72.8777,
      locationAccuracy: 15,
      locationStatus: 'LOCATION_RECEIVED',
      emergencyStatus: 'LOCATION_RECEIVED',
    }

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockCaseResponse)

    const payload = {
      emergencyType: 'SOS_PANIC',
      latitude: 19.076,
      longitude: 72.8777,
      locationAccuracy: 15,
      locationStatus: 'LOCATION_RECEIVED' as const,
    }

    const result = await emergencyLocationService.triggerEmergency(payload)

    expect(apiClient.post).toHaveBeenCalledWith('/emergency/trigger', payload)
    expect(result.caseNumber).toBe('EMG-2026-00101')
    expect(result.latitude).toBe(19.076)
    expect(result.longitude).toBe(72.8777)
    expect(result.isEmergency).toBe(true)
  })

  it('fetches active emergencies for police/ambulance responders', async () => {
    const mockActiveList = [
      {
        id: 'EMG-2026-00101',
        isEmergency: true,
        emergencyStatus: 'LOCATION_RECEIVED',
        latitude: 19.076,
        longitude: 72.8777,
      },
    ]

    vi.mocked(apiClient.get).mockResolvedValueOnce(mockActiveList)

    const activeEmergencies = await emergencyLocationService.getActiveEmergencies()

    expect(apiClient.get).toHaveBeenCalledWith('/emergency/active')
    expect(activeEmergencies).toHaveLength(1)
    expect(activeEmergencies[0].id).toBe('EMG-2026-00101')
  })

  it('updates emergency responder lifecycle status', async () => {
    const mockUpdatedCase = {
      id: 'EMG-2026-00101',
      emergencyStatus: 'RESPONDERS_NOTIFIED',
      responderNotes: 'Police unit 4 dispatched to GPS coordinates',
    }

    vi.mocked(apiClient.patch).mockResolvedValueOnce(mockUpdatedCase)

    const res = await emergencyLocationService.updateStatus(
      'EMG-2026-00101',
      'RESPONDERS_NOTIFIED',
      'Police unit 4 dispatched to GPS coordinates',
    )

    expect(apiClient.patch).toHaveBeenCalledWith('/emergency/EMG-2026-00101/status', {
      emergencyStatus: 'RESPONDERS_NOTIFIED',
      responderNotes: 'Police unit 4 dispatched to GPS coordinates',
    })
    expect(res.emergencyStatus).toBe('RESPONDERS_NOTIFIED')
  })

  it('handles device geolocation failure gracefully without crashing', async () => {
    const targetObj = typeof window !== 'undefined' ? window : (globalThis as unknown as { navigator: Navigator })
    const originalGeolocation = targetObj.navigator.geolocation
    
    // @ts-expect-error - simulating environment without geolocation
    delete targetObj.navigator.geolocation

    const locResult = await getDeviceLocation()
    expect(locResult.success).toBe(false)
    expect(locResult.locationStatus).toBe('LOCATION_UNAVAILABLE')

    // @ts-expect-error - restore geolocation
    targetObj.navigator.geolocation = originalGeolocation
  })
})
