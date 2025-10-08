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
 * Top-level content container with headline and sections
 */
export interface OnePagerContent {
  headline: string;
  subheadline?: string;
  sections: ContentSection[];
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
 */
export interface VersionSnapshot {
  version: number;
  snapshot: {
    content: OnePagerContent;
    layout: LayoutBlock[];
    style_overrides: Record<string, any>;
    status: string;
  };
  created_at: string;
  description?: string;
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
 * Request payload for creating a new OnePager
 */
export interface OnePagerCreateData {
  title: string;
  input_prompt: string;
  brand_kit_id?: string;
  target_audience?: string;
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
}

/**
 * PDF export format options
 */
export type PDFFormat = 'letter' | 'a4' | 'tabloid';
