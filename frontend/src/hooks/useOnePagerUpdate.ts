/**
 * useOnePagerUpdate Hook
 * 
 * React Query mutation hook for updating/saving one-pager changes
 * Handles optimistic updates and backend synchronization
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { backendToFrontend } from '@/types/onepager.types'
import type { FrontendOnePager, BackendOnePager } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

interface UpdateOnePagerPayload {
  onePagerId: string
  updates: Partial<FrontendOnePager>
  feedback?: string // Optional AI feedback for iteration
}

export function useOnePagerUpdate() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (payload: UpdateOnePagerPayload): Promise<BackendOnePager> => {
      const { onePagerId, updates, feedback } = payload

      // Get auth token from localStorage
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        throw new Error('Authentication required. Please log in.')
      }

      // Build request payload for iteration endpoint
      const requestData: any = {}
      
      if (feedback) {
        // If feedback provided, use iterate endpoint for AI refinement
        requestData.feedback = feedback
      }
      
      // Add style overrides if present
      if (updates.style_overrides) {
        requestData.style_overrides = updates.style_overrides
      }
      
      // For now, we'll send a simple update
      // TODO: Implement full layout_changes transformation when needed
      if (updates.title) {
        requestData.title = updates.title
      }

      const response = await axios.put<BackendOnePager>(
        `${API_BASE_URL}/onepagers/${onePagerId}/iterate`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      return response.data
    },
    onMutate: async (payload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['onepager', payload.onePagerId] })

      // Snapshot previous value
      const previousOnePager = queryClient.getQueryData<FrontendOnePager>([
        'onepager',
        payload.onePagerId
      ])

      // Optimistically update to the new value
      if (previousOnePager) {
        queryClient.setQueryData<FrontendOnePager>(
          ['onepager', payload.onePagerId],
          {
            ...previousOnePager,
            ...payload.updates,
            updated_at: new Date().toISOString()
          }
        )
      }

      return { previousOnePager }
    },
    onError: (err, payload, context) => {
      // Rollback on error
      if (context?.previousOnePager) {
        queryClient.setQueryData(
          ['onepager', payload.onePagerId],
          context.previousOnePager
        )
      }
      console.error('Failed to update one-pager:', err)
    },
    onSuccess: (data, payload) => {
      // Update cache with server response
      const frontendOnePager = backendToFrontend(data)
      queryClient.setQueryData(['onepager', payload.onePagerId], frontendOnePager)
      
      // Invalidate list queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['onepagers'] })
    }
  })

  return {
    updateOnePager: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  }
}
