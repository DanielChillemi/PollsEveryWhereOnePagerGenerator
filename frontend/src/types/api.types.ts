/**
 * API Request/Response Types
 * 
 * Type definitions for API interactions
 */

// ============================================
// ONE-PAGER API TYPES
// ============================================

export interface OnePagerFormData {
  title: string;
  product: string;      // Product/service description
  problem: string;      // Problem statement
  target_audience?: string;
  brand_kit_id?: string;
}

export interface OnePagerCreateRequest {
  title: string;
  input_prompt: string;  // Combined product + problem
  target_audience?: string;
  brand_kit_id?: string;
}

export interface OnePagerUpdateRequest {
  title?: string;
  content?: {
    headline?: string;
    subheadline?: string;
    sections?: any[];
  };
  layout?: any[];
  status?: 'draft' | 'wireframe' | 'styled' | 'final';
  style_overrides?: Record<string, any>;
}

// ============================================
// BRAND KIT API TYPES
// ============================================

export interface BrandKitListItem {
  _id: string;
  company_name: string;
  brand_voice?: string;
  is_active: boolean;
  created_at: string;
}

export interface BrandKitOption {
  value: string;
  label: string;
}
