/**
 * Brand Kit Hook
 *
 * React Query hooks for brand kit operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getBrandKit,
  createBrandKit,
  updateBrandKit,
  deleteBrandKit,
  uploadLogo,
} from '../services/api/brandKitService'
import type { BrandKit, BrandKitFormData } from '../types/brandKit'

/**
 * Query key for brand kit data
 */
export const brandKitKeys = {
  all: ['brandKit'] as const,
  detail: () => [...brandKitKeys.all, 'detail'] as const,
}

/**
 * Fetch current user's brand kit
 */
export const useBrandKit = () => {
  return useQuery({
    queryKey: brandKitKeys.detail(),
    queryFn: getBrandKit,
  })
}

/**
 * Create brand kit mutation
 */
export const useCreateBrandKit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBrandKit,
    onSuccess: (data) => {
      queryClient.setQueryData(brandKitKeys.detail(), data)
    },
  })
}

/**
 * Update brand kit mutation
 */
export const useUpdateBrandKit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BrandKitFormData> }) =>
      updateBrandKit(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(brandKitKeys.detail(), data)
    },
  })
}

/**
 * Delete brand kit mutation
 */
export const useDeleteBrandKit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBrandKit,
    onSuccess: () => {
      queryClient.setQueryData(brandKitKeys.detail(), null)
    },
  })
}

/**
 * Upload logo mutation
 */
export const useUploadLogo = () => {
  return useMutation({
    mutationFn: uploadLogo,
  })
}
