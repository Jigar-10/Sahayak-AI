import { create } from 'zustand'

const OWNER_SESSION_KEY = 'sahayak-owner-auth'

interface AuthStore {
  isOwner: boolean
  loginAsOwner: (password: string) => boolean
  logoutOwner: () => void
}

const getInitialOwnerState = () => {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(OWNER_SESSION_KEY) === 'true'
}

export const useAuthStore = create<AuthStore>((set) => ({
  isOwner: getInitialOwnerState(),

  loginAsOwner: (password) => {
    const configuredPassword = import.meta.env.VITE_OWNER_PASSWORD

    if (!configuredPassword || password !== configuredPassword) {
      return false
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(OWNER_SESSION_KEY, 'true')
    }

    set({ isOwner: true })
    return true
  },

  logoutOwner: () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(OWNER_SESSION_KEY)
    }

    set({ isOwner: false })
  },
}))
