/**
 * useOnePager Hook
 * 
 * React Query hook for fetching a single one-pager by ID
 * Handles loading states, error handling, and data transformation
 */

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { backendToFrontend } from '@/types/onepager.types'
import type { BackendOnePager, FrontendOnePager } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

interface UseOnePagerOptions {
  enabled?: boolean
  refetchInterval?: number | false
}

export function useOnePager(onePagerId: string | undefined, options: UseOnePagerOptions = {}) {
  return useQuery({
    queryKey: ['onepager', onePagerId],
    queryFn: async (): Promise<FrontendOnePager> => {
      if (!onePagerId) {
        throw new Error('OnePager ID is required')
      }

      // Get auth token from localStorage
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        throw new Error('Authentication required. Please log in.')
      }

      const response = await axios.get<BackendOnePager>(
        `${API_BASE_URL}/onepagers/${onePagerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      // Transform backend format to frontend format
      return backendToFrontend(response.data)
    },
    enabled: !!onePagerId && (options.enabled !== false),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: options.refetchInterval,
    retry: 2,
  })
}
