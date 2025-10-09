/**
 * useOnePagerCreation Hook
 * 
 * React Query hook for creating new one-pagers with AI generation
 */

import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backendToFrontend } from '@/types/onepager.types'
import { useOnePagerStore } from '@/stores/onePagerStore'
import type { OnePagerCreateRequest } from '@/types/api.types'
import type { BackendOnePager } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export function useOnePagerCreation() {
  const navigate = useNavigate()
  const setOnePager = useOnePagerStore(state => state.setOnePager)

  const mutation = useMutation({
    mutationFn: async (data: OnePagerCreateRequest): Promise<BackendOnePager> => {
      // Get auth token from localStorage (using 'access_token' key)
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        throw new Error('Authentication required. Please log in.')
      }

      const response = await axios.post<BackendOnePager>(
        `${API_BASE_URL}/onepagers`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      return response.data
    },
    onSuccess: (backendOnePager) => {
      // Transform backend format to frontend format
      const frontendOnePager = backendToFrontend(backendOnePager)
      
      // Load into store
      setOnePager(frontendOnePager)
      
      // Navigate to canvas page using the 'id' field (not '_id')
      navigate(`/onepager/${backendOnePager.id}`)
    },
    onError: (error) => {
      console.error('Failed to create one-pager:', error)
      
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
    createOnePager: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  }
}
