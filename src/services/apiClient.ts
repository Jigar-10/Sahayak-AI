/**
 * Centralized API Client for Sahayak AI.
 * Handles automatic JWT Bearer token injection, error normalization, and response parsing.
 */

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? '/api' : 'http://localhost:8080/api')
const TOKEN_KEY = 'sahayak_jwt_token'

export interface ApiClientResponse<T> {
  success: boolean
  message?: string
  data: T
  pagination?: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string>

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  // Inject JWT Token from localStorage if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  try {
    let response: Response
    try {
      response = await fetch(url, config)
    } catch {
      // Catch network-level errors (connection refused, server down, DNS failure)
      throw new ApiError('Unable to connect to the server. Please try again.', 0)
    }

    if (response.status === 204) {
      return {} as T
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status === 401) {
        const errorMsg = data?.message || 'Invalid email or password.'
        throw new ApiError(errorMsg, 401, data?.data)
      }
      if (response.status === 403) {
        throw new ApiError('Your session has expired. Please sign in again.', 403, data?.data)
      }
      if (response.status === 400 || response.status === 409) {
        const errorMsg = data?.message || 'Invalid request. Please verify your details.'
        throw new ApiError(errorMsg, response.status, data?.data)
      }
      const errorMessage = data?.message || `Request failed with status ${response.status}`
      throw new ApiError(errorMessage, response.status, data?.data)
    }

    // Extract data from standard ApiResponse envelope { success: true, data: ... }
    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      return data.data as T
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    const rawMsg = error instanceof Error ? error.message : ''
    if (rawMsg.toLowerCase().includes('failed to fetch') || rawMsg.toLowerCase().includes('networkerror')) {
      throw new ApiError('Unable to connect to the server. Please try again.', 0)
    }
    throw new ApiError(
      rawMsg || 'Unable to connect to the server. Please try again.',
      0,
    )
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  getToken: () => (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null),

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
    }
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
    }
  },
}
