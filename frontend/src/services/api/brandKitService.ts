/**
 * Brand Kit API Service
 *
 * API calls for brand kit CRUD operations
 */

import { apiClient } from './client'
import type { BrandKit, BrandKitFormData } from '../../types/brandKit'

/**
 * Get current user's brand kit
 */
export const getBrandKit = async (): Promise<BrandKit | null> => {
  try {
    const response = await apiClient.get<BrandKit>('/api/v1/brand-kits/me')
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null // No brand kit exists yet
    }
    throw error
  }
}

/**
 * Create a new brand kit
 */
export const createBrandKit = async (data: BrandKitFormData): Promise<BrandKit> => {
  const response = await apiClient.post<BrandKit>('/api/v1/brand-kits', data)
  return response.data
}

/**
 * Update existing brand kit
 */
export const updateBrandKit = async (
  id: string,
  data: Partial<BrandKitFormData>
): Promise<BrandKit> => {
  const response = await apiClient.put<BrandKit>(`/api/v1/brand-kits/${id}`, data)
  return response.data
}

/**
 * Delete brand kit
 */
export const deleteBrandKit = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/brand-kits/${id}`)
}

/**
 * Upload brand logo
 */
export const uploadLogo = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append('logo', file)

  const response = await apiClient.post<{ url: string }>(
    '/api/v1/brand-kits/upload-logo',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}
