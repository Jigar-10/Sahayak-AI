import { create } from 'zustand'
import { authService, type UserProfile } from '@/services/authService'
import { apiClient } from '@/services/apiClient'

interface AuthStore {
  user: UserProfile | null
  token: string | null
  isOwner: boolean
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  ownerLogin: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone?: string, confirmPassword?: string) => Promise<boolean>
  updateProfile: (name: string, phone?: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const getInitialToken = () => apiClient.getToken()

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: getInitialToken(),
  isOwner: false,
  isAuthenticated: !!getInitialToken(),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(email, password)
      const isUserOwner =
        response.user.role === 'ROLE_OWNER' ||
        response.user.role === 'ROLE_ADMIN' ||
        response.user.role === 'OWNER' ||
        response.user.role === 'ADMIN'

      set({
        user: response.user,
        token: response.token,
        isOwner: isUserOwner,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.'
      set({ isLoading: false, error: message })
      return false
    }
  },

  ownerLogin: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.ownerLogin(email, password)
      const isUserOwner =
        response.user.role === 'ROLE_OWNER' ||
        response.user.role === 'ROLE_ADMIN' ||
        response.user.role === 'OWNER' ||
        response.user.role === 'ADMIN'

      if (!isUserOwner) {
        throw new Error('Unauthorized: Account does not have Owner privileges.')
      }

      set({
        user: response.user,
        token: response.token,
        isOwner: true,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid official email or password.'
      set({ isLoading: false, error: message })
      return false
    }
  },

  register: async (name: string, email: string, password: string, phone?: string, confirmPassword?: string) => {
    set({ isLoading: true, error: null })
    try {
      await authService.register(name, email, password, phone, confirmPassword, 'USER')
      set({
        isLoading: false,
        error: null,
      })
      return true
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Registration service is temporarily unavailable. Please try again.'
      set({ isLoading: false, error: message })
      return false
    }
  },

  updateProfile: async (name: string, phone?: string) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await authService.updateProfile(name, phone)
      set((state) => ({
        user: state.user ? { ...state.user, ...updated } : updated,
        isLoading: false,
        error: null,
      }))
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      set({ isLoading: false, error: message })
      return false
    }
  },

  logout: async () => {
    await authService.logout()
    set({
      user: null,
      token: null,
      isOwner: false,
      isAuthenticated: false,
      error: null,
    })
  },

  checkAuth: async () => {
    const token = apiClient.getToken()
    if (!token) {
      set({ user: null, token: null, isOwner: false, isAuthenticated: false, isLoading: false })
      return
    }

    try {
      const user = await authService.getMe()
      const isUserOwner =
        user.role === 'ROLE_OWNER' ||
        user.role === 'ROLE_ADMIN' ||
        user.role === 'OWNER' ||
        user.role === 'ADMIN'

      set({
        user,
        token,
        isOwner: isUserOwner,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      apiClient.removeToken()
      set({ user: null, token: null, isOwner: false, isAuthenticated: false, isLoading: false })
    }
  },
}))
