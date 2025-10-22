/**
 * API Client Configuration
 *
 * Centralized axios client for backend API calls
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// AUTHENTICATION DISABLED FOR DEMO
// Request interceptor - no auth token added
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// Response interceptor - no token refresh
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     return Promise.reject(error)
//   }
// )
