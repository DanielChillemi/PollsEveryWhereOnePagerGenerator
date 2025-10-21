/**
 * OnePager Type Definitions
 *
 * Type-safe interfaces for OnePager data structures.
 * Mirrors backend Pydantic schemas from backend/onepagers/schemas.py
 */

/**
 * Polymorphic content type for sections
 * Handles string (heading, text, button), array (list), or object (hero, features)
 */
export type SectionContentType =
  | string
  | string[]
  | {
      headline?: string;
      subheadline?: string;
      description?: string;
      items?: Array<{ title: string; description: string }>;
      [key: string]: any;
    };

/**
 * Section types supported by the renderer
 * Matches backend ElementType enum
 */
export type SectionType =
  | 'heading'
  | 'text'
  | 'list'
  | 'button'
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'cta'
  | 'footer'
  | 'image';

/**
 * OnePager status values
 */
export type OnePagerStatus = 'wireframe' | 'draft' | 'published' | 'archived';

/**
 * PDF template options for export
 * Maps to backend PDFTemplate enum
 */
export type PDFTemplate = 'minimalist' | 'bold' | 'business' | 'product';

/**
 * Content section within a OnePager
 * Represents a single block of content (e.g., heading, text, list)
 */
export interface ContentSection {
  id: string;
  type: SectionType;
  title?: string;
  content: SectionContentType;
  order: number;
}

/**
 * OnePager content structure
 * Top-level content container with headline, sections, and structured fields
 */
export interface OnePagerContent {
  headline: string;
  subheadline?: string;
  sections: ContentSection[];

  // Structured content fields
  problem?: string;
  solution?: string;
  features?: string[];
  benefits?: string[];
  integrations?: string[];
  social_proof?: string;
  cta?: {
    text: string;
    url: string;
  };
  visuals?: Array<{
    url: string;
    type?: string;
    alt_text?: string;
  }>;
}

/**
 * Layout block positioning information
 * Used for absolute positioning in canvas (future enhancement)
 */
export interface LayoutBlock {
  block_id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: string | number;
    height: string | number;
  };
  order: number;
}

/**
 * AI generation metadata
 * Tracks prompts, iterations, and AI model used
 */
export interface GenerationMetadata {
  prompts: string[];
  iterations: number;
  ai_model: string;
  last_generated_at: string;
}

/**
 * Version history snapshot
 * Captures state at a specific point in time
 * Includes layout_params to restore complete design state
 */
export interface VersionSnapshot {
  version: number;
  content: OnePagerContent;
  layout: LayoutBlock[];
  layout_params?: LayoutParams | null;  // Added for complete state restoration
  created_at: string;
  change_description?: string;  // Changed from 'description' to match backend
}

/**
 * LayoutParams Type Definitions
 * ===============================
 * Types for AI-driven layout customization beyond content.
 * Mirrors backend LayoutParams model from backend/models/onepager.py
 */

/**
 * Color scheme configuration
 * All colors must be in hex format (#RRGGBB)
 */
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  text_primary: string;
  background: string;
}

/**
 * Typography scaling configuration
 * All scales have validation ranges (see backend model)
 */
export interface Typography {
  heading_font: string;
  body_font: string;
  h1_scale: number;          // 0.8 - 1.5
  h2_scale: number;          // 0.8 - 1.5
  body_scale: number;        // 0.8 - 1.3
  line_height_scale: number; // 0.8 - 1.4
}

/**
 * Spacing configuration
 * Controls section gaps and padding
 */
export interface Spacing {
  section_gap: 'tight' | 'normal' | 'loose';
  padding_scale: number; // 0.5 - 2.0
}

/**
 * Section-specific layout configuration
 * Defines columns, alignment, and image positioning
 */
export interface SectionLayout {
  columns: 1 | 2 | 3;
  alignment: 'left' | 'center' | 'right';
  image_position?: 'top' | 'left' | 'right' | 'none' | null;
}

/**
 * Complete layout parameters
 * Container for all design customization settings
 */
export interface LayoutParams {
  color_scheme: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  section_layouts: Record<string, SectionLayout>;
}

/**
 * Complete OnePager data structure
 * Full representation with all metadata
 */
export interface OnePager {
  id: string;
  user_id: string;
  brand_kit_id?: string;
  title: string;
  status: OnePagerStatus;
  content: OnePagerContent;
  layout: LayoutBlock[];
  style_overrides: Record<string, any>;
  generation_metadata: GenerationMetadata;
  version_history: VersionSnapshot[];
  layout_params?: LayoutParams | null;
  design_rationale?: string | null;
  pdf_template: PDFTemplate;  // PDF template for export
  created_at: string;
  updated_at: string;
  last_accessed: string;
}

/**
 * OnePager summary for list views
 * Lightweight version without full content
 */
export interface OnePagerSummary {
  id: string;
  title: string;
  status: OnePagerStatus;
  created_at: string;
  updated_at: string;
  has_brand_kit: boolean;
}

/**
 * Call-to-action data
 */
export interface CTAData {
  text: string;
  url: string;
}

/**
 * Visual/image data
 */
export interface VisualData {
  url: string;
  type?: string;
  alt_text?: string;
}

/**
 * Request payload for creating a new OnePager
 * Enhanced with structured fields from Week 2 MVP requirements
 */
export interface OnePagerCreateData {
  title: string;

  // Product selection
  product_id?: string;

  // Core content fields (required)
  problem: string;
  solution: string;
  features: string[];
  benefits: string[];

  // Optional fields
  integrations?: string[];
  social_proof?: string;
  cta: CTAData;
  visuals?: VisualData[];

  // Brand and audience
  brand_kit_id?: string;
  target_audience?: string;

  // AI generation (optional)
  input_prompt?: string;
}

/**
 * Request payload for AI iterative refinement
 */
export interface OnePagerIterateData {
  feedback: string;
  iteration_type?: 'content' | 'layout' | 'both';
  preserve_elements?: string[];
}

/**
 * Request payload for updating OnePager metadata
 */
export interface OnePagerUpdateData {
  title?: string;
  status?: OnePagerStatus;
  style_overrides?: Record<string, any>;
  brand_kit_id?: string;
  pdf_template?: PDFTemplate;
}

/**
 * PDF export format options
 */
export type PDFFormat = 'letter' | 'a4' | 'tabloid';

/**
 * Response from suggest-layout API endpoint
 * AI suggestions for layout parameters without modifying content
 */
export interface LayoutSuggestionResponse {
  suggested_layout_params: LayoutParams;
  design_rationale: string;
}

/**
 * Helper function to get default layout parameters
 * Mirrors backend get_default_layout_params()
 */
export function getDefaultLayoutParams(): LayoutParams {
  return {
    color_scheme: {
      primary: '#1568B8',
      secondary: '#864CBD',
      accent: '#FF6B6B',
      text_primary: '#1A202C',
      background: '#FFFFFF',
    },
    typography: {
      heading_font: 'Inter',
      body_font: 'Inter',
      h1_scale: 1.0,
      h2_scale: 1.0,
      body_scale: 1.0,
      line_height_scale: 1.0,
    },
    spacing: {
      section_gap: 'normal',
      padding_scale: 1.0,
    },
    section_layouts: {
      features: {
        columns: 2,
        alignment: 'left',
        image_position: 'top',
      },
      benefits: {
        columns: 1,
        alignment: 'center',
        image_position: 'top',
      },
      integrations: {
        columns: 3,
        alignment: 'left',
        image_position: 'top',
      },
    },
  };
}
