/**
 * useOnePagerDelete Hook
 * 
 * React Query hook for deleting one-pagers
 * Handles cache invalidation and optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export function useOnePagerDelete() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (onePagerId: string): Promise<void> => {
      // Get auth token from localStorage
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        throw new Error('Authentication required. Please log in.')
      }

      await axios.delete(
        `${API_BASE_URL}/onepagers/${onePagerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
    },
    onSuccess: (_, deletedId) => {
      // Invalidate one-pager list to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['onepagers'] })
      
      // Remove the specific one-pager from cache
      queryClient.removeQueries({ queryKey: ['onepagers', deletedId] })
      
      console.log('One-pager deleted successfully:', deletedId)
    },
    onError: (error) => {
      console.error('Failed to delete one-pager:', error)
      
      // Handle specific error cases
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Redirect to login on auth failure
          navigate('/login')
        }
      }
    }
  })

  return {
    deleteOnePager: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  }
}
