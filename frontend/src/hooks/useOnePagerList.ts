/**
 * useOnePagerList Hook
 * 
 * React Query hook for fetching a list of user's one-pagers
 * Supports pagination and status filtering
 */

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export interface OnePagerSummary {
  id: string
  title: string
  status: 'draft' | 'wireframe' | 'styled' | 'final'
  created_at: string
  updated_at: string
  has_brand_kit: boolean
}

interface UseOnePagerListOptions {
  skip?: number
  limit?: number
  status?: string
  enabled?: boolean
}

export function useOnePagerList(options: UseOnePagerListOptions = {}) {
  const { skip = 0, limit = 20, status, enabled = true } = options

  return useQuery({
    queryKey: ['onepagers', { skip, limit, status }],
    queryFn: async (): Promise<OnePagerSummary[]> => {
      // Get auth token from localStorage
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        throw new Error('Authentication required. Please log in.')
      }

      // Build query parameters
      const params = new URLSearchParams()
      params.append('skip', skip.toString())
      params.append('limit', limit.toString())
      if (status) {
        params.append('status', status)
      }

      const response = await axios.get<OnePagerSummary[]>(
        `${API_BASE_URL}/onepagers?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      return response.data
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  })
}
