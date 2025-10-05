/**
 * Authentication React Query Hooks
 * 
 * Custom hooks for authentication operations using TanStack Query.
 * Handles server state, caching, and optimistic updates.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api/authService'
import { useAuthStore } from '../stores/authStore'

/**
 * Hook for user login
 * 
 * Handles login mutation, token storage, and navigation
 */
export const useLogin = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store tokens in localStorage and auth store
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      
      // Fetch user profile after successful login
      authService.getCurrentUser().then((user) => {
        setAuth(user, data.access_token, data.refresh_token)
        console.log('✅ Login successful:', user.email)
        navigate('/dashboard')
      })
    },
    onError: (error: any) => {
      console.error('❌ Login failed:', error.response?.data?.detail || error.message)
    },
  })
}

/**
 * Hook for user signup
 * 
 * Handles registration and automatic login
 */
export const useSignup = () => {
  const login = useLogin()

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (_, variables) => {
      console.log('✅ Account created! Auto-logging in...')
      
      // Auto-login after successful signup
      login.mutate({
        email: variables.email,
        password: variables.password,
      })
    },
    onError: (error: any) => {
      console.error('❌ Signup failed:', error.response?.data?.detail || error.message)
    },
  })
}

/**
 * Hook for user logout
 * 
 * Clears auth state and redirects to login
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()
  const queryClient = useQueryClient()

  return () => {
    // Clear tokens and auth state
    authService.logout()
    clearAuth()
    
    // Clear all queries
    queryClient.clear()
    
    console.log('👋 Signed out successfully')
    
    // Redirect to login
    navigate('/login')
  }
}

/**
 * Hook to get current user profile
 * 
 * Fetches and caches user data
 * Only runs if user is authenticated
 */
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

/**
 * Hook to check if user is authenticated
 * 
 * Returns auth status from Zustand store
 */
export const useAuth = () => {
  const { user, isAuthenticated, accessToken } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading: false, // Will be set by query if needed
    accessToken,
  }
}
