/**
 * Authentication Store (Zustand)
 *
 * Global state management for user authentication
 */

import { create } from 'zustand'

interface User {
  id: string
  email: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
  brand_kit_id?: string | null
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  updateUser: (user: User) => void
  initializeAuth: () => Promise<void>
}

// Helper to get stored user data
const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isInitialized: false,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    })
  },

  clearAuth: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  initializeAuth: async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      set({ isInitialized: true })
      return
    }

    try {
      // Verify token by fetching user profile
      const response = await fetch('http://localhost:8000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const user = await response.json()
        set({
          user,
          isAuthenticated: true,
          isInitialized: true
        })
      } else {
        // Token is invalid or expired (expected scenario)
        // Silently clear auth without logging error
        get().clearAuth()
        set({ isInitialized: true })
      }
    } catch (error) {
      // Network error or other unexpected issue
      // Silently clear auth - user will need to log in again
      get().clearAuth()
      set({ isInitialized: true })
    }
  },
}))
