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
    // Transform frontend data format to match backend schema
    const backendData = {
      company_name: data.company_name,
      brand_voice: "Professional and engaging", // Default value
      color_palette: {
        primary: data.primary_color,
        secondary: data.secondary_color,
        accent: data.accent_color,
        text: data.text_color,
        background: data.background_color,
      },
      typography: {
        heading_font: data.primary_font,
        body_font: data.primary_font,
        heading_size: "36px",
        body_size: "16px",
      },
      logo_url: data.logo_url || null,
      target_audiences: data.target_audiences.filter(
        (aud) => aud.name.trim() !== '' || aud.description.trim() !== ''
      ),
    };

    console.log('=== BRAND KIT DATA BEING SENT ===');
    console.log('Frontend data:', data);
    console.log('Transformed backend data:', backendData);
    console.log('JSON:', JSON.stringify(backendData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/api/v1/brand-kits`, backendData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // Transform _id to id for frontend compatibility
    return { ...response.data, id: response.data._id };
  },

  /**
   * Get all Brand Kits for the current user
   */
  async getAll(token: string): Promise<BrandKit | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/brand-kits/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Backend returns single brand kit or 404, wrap in array for frontend compatibility
      // Transform backend format to frontend format
      if (response.data) {
        const backendKit = response.data;
        const kit = {
          ...backendKit,
          id: backendKit._id,
          primary_color: backendKit.color_palette?.primary,
          secondary_color: backendKit.color_palette?.secondary,
          accent_color: backendKit.color_palette?.accent,
          text_color: backendKit.color_palette?.text,
          background_color: backendKit.color_palette?.background,
          primary_font: backendKit.typography?.heading_font,
        };
        return [kit];
      }
      return [];
    } catch (error: any) {
      // Handle 404 - no brand kit found
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
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
    // Transform backend format to frontend format
    const backendKit = response.data;
    return {
      ...backendKit,
      id: backendKit._id,
      primary_color: backendKit.color_palette?.primary,
      secondary_color: backendKit.color_palette?.secondary,
      accent_color: backendKit.color_palette?.accent,
      text_color: backendKit.color_palette?.text,
      background_color: backendKit.color_palette?.background,
      primary_font: backendKit.typography?.heading_font,
    };
  },

  /**
   * Update an existing Brand Kit
   */
  async update(id: string, data: Partial<BrandKitData>, token: string): Promise<BrandKit> {
    // Transform frontend data format to match backend schema (same as create)
    const backendData: any = {};

    if (data.company_name) backendData.company_name = data.company_name;
    if (data.primary_font) {
      backendData.typography = {
        heading_font: data.primary_font,
        body_font: data.primary_font,
        heading_size: "36px",
        body_size: "16px",
      };
    }
    if (data.primary_color || data.secondary_color || data.accent_color || data.text_color || data.background_color) {
      backendData.color_palette = {
        primary: data.primary_color,
        secondary: data.secondary_color,
        accent: data.accent_color,
        text: data.text_color,
        background: data.background_color,
      };
    }
    if (data.logo_url !== undefined) backendData.logo_url = data.logo_url || null;
    if (data.target_audiences) {
      backendData.target_audiences = data.target_audiences.filter(
        (aud) => aud.name.trim() !== '' || aud.description.trim() !== ''
      );
    }

    const response = await axios.put(`${API_BASE_URL}/api/v1/brand-kits/${id}`, backendData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // Transform _id to id for frontend compatibility
    return { ...response.data, id: response.data._id };
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
