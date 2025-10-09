/**
 * OnePager Type Definitions
 * ==========================
 * 
 * This file defines TypeScript interfaces for one-pager data structures.
 * It includes both backend API types and frontend display types, plus
 * transformation adapters to convert between them.
 * 
 * Backend uses dual structure (content.sections + layout arrays)
 * Frontend uses unified structure (single elements array)
 */

// ============================================
// BACKEND API RESPONSE TYPES (from MongoDB)
// ============================================

export interface BackendSection {
  id: string;
  type: 'heading' | 'text' | 'list' | 'button' | 'image';
  title: string | null;
  content: string | string[] | Record<string, any>;
  order: number;
}

export interface BackendLayout {
  block_id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: string;
    height: string;
  };
  order: number;
}

export interface BackendOnePager {
  id: string;  // Backend transforms _id to id in API response
  user_id: string;
  brand_kit_id: string | null;  // Can be null if no brand kit
  title: string;
  status: 'draft' | 'wireframe' | 'styled' | 'final';
  content: {
    headline: string;
    subheadline?: string;
    sections: BackendSection[];
  };
  layout: BackendLayout[];
  style_overrides: Record<string, any>;
  generation_metadata: {
    prompts: string[];
    iterations: number;
    ai_model: string;
    last_generated_at: string;
  };
  version_history: any[];
  created_at: string;
  updated_at: string;
  last_accessed?: string;
}

// ============================================
// FRONTEND DISPLAY TYPES (for Smart Canvas)
// ============================================

export type ElementType = 
  | 'hero'      // Headline + subheadline + CTA
  | 'heading'   // Section heading
  | 'text'      // Paragraph text
  | 'features'  // Feature list with enhanced rendering
  | 'list'      // Simple bullet list
  | 'cta'       // Call-to-action button (enhanced)
  | 'button'    // Simple button
  | 'image';    // Image element

export interface ElementStyling {
  background_color?: string;
  text_color?: string;
  font_size?: number;
  font_weight?: 'normal' | 'medium' | 'bold' | 'extra_bold';
  text_align?: 'left' | 'center' | 'right';
  padding?: number;
  border_radius?: number;
}

// Content types for each element
export interface HeroContent {
  headline: string;
  subheadline?: string;
  description?: string;
  cta_text?: string;
  cta_url?: string;
}

export interface HeadingContent {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface TextContent {
  text: string;
}

export interface FeaturesContent {
  title?: string;
  items: string[];
}

export interface ListContent {
  items: string[];
}

export interface CTAContent {
  text: string;
  url?: string;
}

export interface ButtonContent {
  text: string;
  url?: string;
}

export interface ImageContent {
  url: string;
  alt?: string;
  caption?: string;
}

export type ElementContent =
  | HeroContent
  | HeadingContent
  | TextContent
  | FeaturesContent
  | ListContent
  | CTAContent
  | ButtonContent
  | ImageContent;

export interface FrontendElement {
  id: string;
  type: ElementType;
  content: ElementContent;
  order: number;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: string;
    height: string;
  };
  styling?: ElementStyling;
}

export interface FrontendOnePager {
  id: string;
  user_id: string;
  brand_kit_id: string;
  title: string;
  status: 'draft' | 'wireframe' | 'styled' | 'final';
  elements: FrontendElement[];
  style_overrides: Record<string, any>;
  created_at: string;
  updated_at: string;
  version: number;
}

// ============================================
// CANVAS UI TYPES
// ============================================

export type CanvasMode = 'wireframe' | 'styled';

export interface CanvasState {
  mode: CanvasMode;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  isEditing: boolean;
  zoom: number; // 0.5 to 2.0
}

// ============================================
// DATA TRANSFORMATION ADAPTERS
// ============================================

/**
 * Convert backend API response to frontend format
 * Merges content.sections + layout into unified elements array
 */
export function backendToFrontend(
  backendData: BackendOnePager
): FrontendOnePager {
  // Create hero element from headline/subheadline
  const heroElement: FrontendElement = {
    id: 'hero-main',
    type: 'hero',
    content: {
      headline: backendData.content.headline,
      subheadline: backendData.content.subheadline,
    } as HeroContent,
    order: 0,
  };

  // Transform sections into elements
  const sectionElements: FrontendElement[] = backendData.content.sections.map(
    (section) => {
      const layoutBlock = backendData.layout.find(
        (block) => block.block_id === `block-${section.id}`
      );

      const type = mapBackendTypeToFrontend(section.type);

      return {
        id: section.id,
        type,
        content: transformContent(section, type),
        order: section.order,
        position: layoutBlock?.position,
        size: layoutBlock?.size,
        styling: backendData.style_overrides[section.id] || {},
      };
    }
  );

  return {
    id: backendData.id,  // Backend returns 'id' not '_id'
    user_id: backendData.user_id,
    brand_kit_id: backendData.brand_kit_id || '',  // Handle null case
    title: backendData.title,
    status: backendData.status,
    elements: [heroElement, ...sectionElements].sort((a, b) => a.order - b.order),
    style_overrides: backendData.style_overrides,
    created_at: backendData.created_at,
    updated_at: backendData.updated_at,
    version: backendData.generation_metadata.iterations + 1,
  };
}

/**
 * Convert frontend format back to backend API format
 * Splits elements into content.sections + layout arrays
 */
export function frontendToBackend(
  frontendData: FrontendOnePager
): Partial<BackendOnePager> {
  // Extract hero content
  const heroElement = frontendData.elements.find((el) => el.type === 'hero');
  const heroContent = heroElement?.content as HeroContent | undefined;

  // Convert elements back to sections (excluding hero)
  const sections: BackendSection[] = frontendData.elements
    .filter((el) => el.type !== 'hero')
    .map((el) => {
      const backendType = mapFrontendTypeToBackend(el.type);
      const content = transformContentToBackend(el.content, el.type);

      return {
        id: el.id,
        type: backendType as 'heading' | 'text' | 'list' | 'button' | 'image',
        title: null,
        content,
        order: el.order,
      };
    });

  // Convert elements to layout blocks
  const layout: BackendLayout[] = frontendData.elements
    .filter((el) => el.type !== 'hero')
    .map((el) => ({
      block_id: `block-${el.id}`,
      type: mapFrontendTypeToBackend(el.type),
      position: el.position || { x: 0, y: 0 },
      size: el.size || { width: '100%', height: 'auto' },
      order: el.order,
    }));

  return {
    title: frontendData.title,
    content: {
      headline: heroContent?.headline || 'Untitled',
      subheadline: heroContent?.subheadline,
      sections,
    },
    layout,
    style_overrides: frontendData.style_overrides,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function mapBackendTypeToFrontend(backendType: string): ElementType {
  const mapping: Record<string, ElementType> = {
    heading: 'heading',
    text: 'text',
    list: 'features', // Upgrade list to features for richer rendering
    button: 'cta',    // Upgrade button to CTA for enhanced styling
    image: 'image',
  };
  return mapping[backendType] || (backendType as ElementType);
}

function mapFrontendTypeToBackend(frontendType: ElementType): string {
  const mapping: Record<ElementType, string> = {
    hero: 'hero',
    heading: 'heading',
    text: 'text',
    features: 'list',  // Features → list in backend
    list: 'list',
    cta: 'button',     // CTA → button in backend
    button: 'button',
    image: 'image',
  };
  return mapping[frontendType] || frontendType;
}

function transformContent(
  section: BackendSection,
  frontendType: ElementType
): ElementContent {
  switch (frontendType) {
    case 'heading':
      return {
        text: typeof section.content === 'string' ? section.content : '',
        level: 2,
      } as HeadingContent;

    case 'text':
      return {
        text: typeof section.content === 'string' ? section.content : '',
      } as TextContent;

    case 'features':
    case 'list':
      return {
        items: Array.isArray(section.content) ? section.content : [],
      } as FeaturesContent;

    case 'cta':
    case 'button':
      return {
        text: typeof section.content === 'string' ? section.content : 'Click Here',
        url: '#',
      } as CTAContent;

    case 'image':
      return {
        url: typeof section.content === 'string' ? section.content : '',
        alt: 'Image',
      } as ImageContent;

    default:
      return { text: String(section.content) } as TextContent;
  }
}

function transformContentToBackend(
  content: ElementContent,
  type: ElementType
): string | string[] | Record<string, any> {
  switch (type) {
    case 'heading':
      return (content as HeadingContent).text;

    case 'text':
      return (content as TextContent).text;

    case 'features':
    case 'list':
      return (content as FeaturesContent).items;

    case 'cta':
    case 'button':
      return (content as CTAContent).text;

    case 'image':
      return (content as ImageContent).url;

    default:
      return String(content);
  }
}

// ============================================
// TYPE GUARDS
// ============================================

export function isHeroContent(content: ElementContent): content is HeroContent {
  return 'headline' in content;
}

export function isHeadingContent(content: ElementContent): content is HeadingContent {
  return 'text' in content && 'level' in content;
}

export function isFeaturesContent(content: ElementContent): content is FeaturesContent {
  return 'items' in content && Array.isArray((content as FeaturesContent).items);
}

export function isCTAContent(content: ElementContent): content is CTAContent {
  return 'text' in content && ('url' in content || !('items' in content));
}

export function isImageContent(content: ElementContent): content is ImageContent {
  return 'url' in content && !('text' in content);
}
