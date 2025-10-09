/**
 * Brand Kit Type Definitions
 * ===========================
 * 
 * Type definitions for Brand Kit data structures used in the Smart Canvas
 * for applying brand styling to one-pager elements.
 */

// ============================================
// BRAND KIT TYPES
// ============================================

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
  heading_weights?: number[];
  body_weights?: number[];
}

export interface TargetAudience {
  name: string;
  description: string;
}

export interface BrandKit {
  id: string;
  user_id: string;
  company_name: string;
  brand_voice?: string;
  color_palette: ColorPalette;
  typography: Typography;
  logo_url?: string;
  target_audiences?: TargetAudience[];
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandKitCreateData {
  company_name: string;
  brand_voice?: string;
  color_palette: ColorPalette;
  typography: Typography;
  logo_url?: string;
  target_audiences?: TargetAudience[];
}

export interface BrandKitUpdateData extends Partial<BrandKitCreateData> {}

// ============================================
// SIMPLIFIED TYPES FOR CANVAS USE
// ============================================

/**
 * Simplified brand context for canvas rendering
 * Contains only the essential styling information
 */
export interface BrandContext {
  colors: ColorPalette;
  fonts: Typography;
  logo_url?: string;
}

/**
 * Extract brand context from full Brand Kit
 */
export function extractBrandContext(brandKit: BrandKit): BrandContext {
  return {
    colors: brandKit.color_palette,
    fonts: brandKit.typography,
    logo_url: brandKit.logo_url,
  };
}
