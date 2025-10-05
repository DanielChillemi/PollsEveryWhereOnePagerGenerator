/**
 * One-Pager Types
 *
 * Type definitions for one-pager state and rendering
 */

export type SectionType =
  | 'hero'
  | 'features'
  | 'benefits'
  | 'testimonials'
  | 'cta'
  | 'stats'
  | 'about'
  | 'contact'

export interface OnePagerSection {
  id: string
  type: SectionType
  order: number
  data: {
    title?: string
    subtitle?: string
    description?: string
    content?: string
    image_url?: string
    button_text?: string
    button_url?: string
    items?: Array<{
      id: string
      title?: string
      description?: string
      icon?: string
      value?: string
      label?: string
    }>
  }
  styling?: {
    backgroundColor?: string
    textColor?: string
    alignment?: 'left' | 'center' | 'right'
    padding?: string
  }
}

export interface OnePagerState {
  id?: string
  user_id?: string
  title: string
  description?: string
  brand_kit_id?: string
  sections: OnePagerSection[]
  created_at?: string
  updated_at?: string
  version?: number
}

export type RenderMode = 'wireframe' | 'styled'
