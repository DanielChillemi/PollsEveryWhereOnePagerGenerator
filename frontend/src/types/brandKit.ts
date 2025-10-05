/**
 * Brand Kit Types
 *
 * Type definitions for brand kit data structures
 */

export interface BrandKit {
  id?: string
  user_id?: string
  company_name: string
  primary_color: string
  secondary_color: string
  accent_color: string
  font_heading: string
  font_body: string
  logo_url?: string
  brand_voice?: string
  created_at?: string
  updated_at?: string
}

export interface BrandKitFormData {
  company_name: string
  primary_color: string
  secondary_color: string
  accent_color: string
  font_heading: string
  font_body: string
  logo_url?: string
  brand_voice?: string
}

export const FONT_OPTIONS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
] as const
