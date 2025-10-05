/**
 * Authentication Service
 * 
 * API service layer for authentication operations.
 * Uses the configured apiClient with automatic token injection and refresh.
 */

import { apiClient } from './client'
import type { User, TokenResponse, LoginFormData, SignupFormData } from '../../types/auth'

/**
 * User signup/registration
 * 
 * @param data - Signup form data (email, password, full_name)
 * @returns User profile data
 */
export const signup = async (data: SignupFormData): Promise<User> => {
  const response = await apiClient.post<User>('/api/v1/auth/signup', data)
  return response.data
}

/**
 * User login
 * 
 * @param data - Login credentials (email, password)
 * @returns Token response with access_token and refresh_token
 */
export const login = async (data: LoginFormData): Promise<TokenResponse> => {
  // OAuth2 password flow uses form data format
  const formData = new URLSearchParams()
  formData.append('username', data.email) // OAuth2 uses 'username' field
  formData.append('password', data.password)

  const response = await apiClient.post<TokenResponse>(
    '/api/v1/auth/login',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
  return response.data
}

/**
 * Get current user profile
 * 
 * Requires valid access token (automatically added by apiClient interceptor)
 * 
 * @returns Current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/api/v1/auth/me')
  return response.data
}

/**
 * Refresh access token
 * 
 * @param refreshToken - The refresh token
 * @returns New token response
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/api/v1/auth/refresh', {
    refresh_token: refreshToken,
  })
  return response.data
}

/**
 * Logout user
 * 
 * Clears tokens from localStorage and auth store
 * No API call needed - JWT is stateless
 */
export const logout = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const authService = {
  signup,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
}

export default authService
