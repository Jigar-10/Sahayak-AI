import { apiClient } from './apiClient'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: 'ROLE_USER' | 'ROLE_OWNER' | 'ROLE_ADMIN' | string
  active: boolean
}

export interface AuthResponseData {
  token: string
  type: string
  user: UserProfile
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponseData> => {
    const res = await apiClient.post<AuthResponseData>('/auth/login', { email, password })
    if (res.token) {
      apiClient.setToken(res.token)
    }
    return res
  },

  register: async (
    fullName: string,
    email: string,
    password: string,
    phone?: string,
    confirmPassword?: string,
    role = 'USER',
  ): Promise<AuthResponseData> => {
    const res = await apiClient.post<AuthResponseData>('/auth/register', {
      fullName,
      name: fullName,
      email,
      password,
      confirmPassword: confirmPassword || password,
      phone: phone || undefined,
      role,
    })
    return res
  },

  getMe: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/users/me')
  },

  updateProfile: async (name: string, phone?: string): Promise<UserProfile> => {
    return apiClient.put<UserProfile>('/users/me', { name, phone })
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Ignore network errors on logout
    } finally {
      apiClient.removeToken()
    }
  },
}
