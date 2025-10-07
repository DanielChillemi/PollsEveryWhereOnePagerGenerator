import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface BrandKitData {
  company_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  primary_font: string;
  logo_url?: string;
  target_audiences: Array<{
    name: string;
    description: string;
  }>;
}

export interface BrandKit extends BrandKitData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Brand Kit API Service
 * Handles all Brand Kit CRUD operations
 */
export const brandKitService = {
  /**
   * Create a new Brand Kit
   */
  async create(data: BrandKitData, token: string): Promise<BrandKit> {
    const response = await axios.post(`${API_BASE_URL}/api/v1/brand-kits`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  /**
   * Get all Brand Kits for the current user
   */
  async getAll(token: string): Promise<BrandKit[]> {
    const response = await axios.get(`${API_BASE_URL}/api/v1/brand-kits`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Get a single Brand Kit by ID
   */
  async getById(id: string, token: string): Promise<BrandKit> {
    const response = await axios.get(`${API_BASE_URL}/api/v1/brand-kits/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Update an existing Brand Kit
   */
  async update(id: string, data: Partial<BrandKitData>, token: string): Promise<BrandKit> {
    const response = await axios.put(`${API_BASE_URL}/api/v1/brand-kits/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  /**
   * Delete a Brand Kit
   */
  async delete(id: string, token: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/v1/brand-kits/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
