import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Product {
  id?: string;
  name: string;
  description?: string;
  default_problem?: string;
  default_solution?: string;
  features?: string[];
  benefits?: string[];
}

export interface TargetAudience {
  name: string;
  description: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface Typography {
  heading_font: string;
  body_font: string;
  heading_size?: string;
  body_size?: string;
}

export interface BrandKitData {
  company_name: string;
  brand_voice?: string;
  color_palette: ColorPalette;
  typography: Typography;
  logo_url?: string;
  target_audiences: TargetAudience[];
  products?: Product[];
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
    console.log('=== BRAND KIT DATA BEING SENT ===');
    console.log('Brand Kit data:', data);
    console.log('JSON:', JSON.stringify(data, null, 2));

    const response = await axios.post(`${API_BASE_URL}/api/v1/brand-kits`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Transform backend response to frontend format
    const backendKit = response.data;
    return {
      ...backendKit,
      id: backendKit._id || backendKit.id,
    };
  },

  /**
   * Get all Brand Kits for the current user
   */
  async getAll(token: string): Promise<BrandKit[]> {
    const response = await axios.get(`${API_BASE_URL}/api/v1/brand-kits/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Backend returns array of brand kits with nested structure
    const backendKits = response.data || [];

    return backendKits.map((backendKit: any) => ({
      ...backendKit,
      id: backendKit._id || backendKit.id,
    }));
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
    
    // Backend returns brand kit with nested structure
    const backendKit = response.data;
    return {
      ...backendKit,
      id: backendKit._id || backendKit.id,
    };
  },

  /**
   * Update an existing Brand Kit
   */
  async update(id: string, data: Partial<BrandKitData>, token: string): Promise<BrandKit> {
    console.log('=== UPDATING BRAND KIT ===');
    console.log('Update data:', data);
    console.log('JSON:', JSON.stringify(data, null, 2));

    try {
      const response = await axios.put(`${API_BASE_URL}/api/v1/brand-kits/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Backend returns updated brand kit with nested structure
      const backendKit = response.data;
      return {
        ...backendKit,
        id: backendKit._id || backendKit.id,
      };
    } catch (error: any) {
      console.error('=== BRAND KIT UPDATE ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Validation errors:', JSON.stringify(error.response?.data?.detail, null, 2));
      throw error;
    }
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
