/**
 * Authentication Type Definitions
 * 
 * Type-safe interfaces for authentication flows, API responses,
 * and form data used throughout the auth system.
 */

/**
 * User object returned from API
 * Matches backend UserProfileResponse schema
 */
export interface User {
  id: string
  email: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
  brand_kit_id?: string | null
}

/**
 * Token response from login/refresh endpoints
 * Matches backend TokenResponse schema
 */
export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  expires_in: number
}

/**
 * Login form data
 */
export interface LoginFormData {
  email: string
  password: string
}

/**
 * Signup form data
 */
export interface SignupFormData {
  email: string
  password: string
  full_name: string
}

/**
 * Auth error response from API
 */
export interface AuthError {
  detail: string
  status?: number
}

/**
 * Form validation errors
 */
export interface FormErrors {
  email?: string
  password?: string
  full_name?: string
  general?: string
}

/**
 * Auth context state
 */
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginFormData) => Promise<void>
  signup: (data: SignupFormData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}
