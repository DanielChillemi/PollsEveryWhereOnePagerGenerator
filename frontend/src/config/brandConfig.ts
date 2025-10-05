/**
 * Poll Everywhere Brand Configuration
 * 
 * Centralized brand guidelines and design system configuration
 * for the Marketing One-Pager Co-Creation Tool.
 * 
 * Based on Poll Everywhere Design System v2.0
 */

/**
 * Brand Color Palette
 * Primary colors from Poll Everywhere design system
 */
export const brandColors = {
  primary: '#007ACC',        // Primary Blue - Main brand color
  purple: '#864CBD',         // Purple Accent - Gradient start
  deepBlue: '#1568B8',       // Deep Blue - Gradient end
  background: '#FFFFFF',     // Background White - Clean, modern
  text: '#333333',           // Text Color - Body text
  textLight: '#666666',      // Secondary Text - Muted content
  textDark: '#1a1a1a',       // Dark Text - Headlines
  border: '#e0e0e0',         // Border Color - Dividers
  backgroundGray: '#f8f9fa', // Light Gray Background - Cards
  backgroundBlue: '#f0f4f8', // Light Blue Background - Stats sections
} as const

/**
 * Extended Color Scales
 * Shades for UI components and interactive states
 */
export const colorScales = {
  blue: {
    50: '#e6f4ff',
    100: '#b3ddff',
    200: '#80c7ff',
    300: '#4db0ff',
    400: '#1a99ff',
    500: '#007ACC',  // Primary
    600: '#0062a3',
    700: '#004a7a',
    800: '#003251',
    900: '#001a29',
  },
  purple: {
    50: '#f3e8fb',
    100: '#ddc2f1',
    200: '#c79ce7',
    300: '#b176dd',
    400: '#9b50d3',
    500: '#864CBD',  // Purple Accent
    600: '#6d3d9a',
    700: '#542e77',
    800: '#3b1f54',
    900: '#221031',
  },
} as const

/**
 * Brand Gradients
 * Signature Poll Everywhere gradient for CTAs and hero elements
 */
export const brandGradients = {
  primary: 'linear-gradient(135deg, #864CBD 0%, #1568B8 100%)',
  primaryHover: 'linear-gradient(135deg, #9b50d3 0%, #1a99ff 100%)',
  subtle: 'linear-gradient(180deg, #f0f4f8 0%, #FFFFFF 100%)',
} as const

/**
 * Typography Configuration
 * Source Sans Pro font family with weight and size scales
 */
export const typography = {
  fontFamily: {
    base: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Courier New', 'Consolas', monospace",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',    // Body text
    xl: '20px',
    '2xl': '24px', // H3
    '3xl': '32px', // H2
    '4xl': '48px', // H1 Hero
    '5xl': '56px', // Stats numbers
  },
  fontWeight: {
    light: 300,
    normal: 400,    // Body text
    semibold: 600,  // H3, Buttons
    bold: 700,      // H1, H2
  },
  lineHeight: {
    tight: 1.2,     // Headlines
    normal: 1.6,    // Body text
    relaxed: 1.8,   // Long-form content
  },
} as const

/**
 * Spacing Scale
 * 8px base unit system for consistent spacing
 */
export const spacing = {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
  xxl: '64px',
  xxxl: '80px',
} as const

/**
 * Border Radius Values
 * Rounded corners for modern aesthetic
 */
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '50px',    // Fully rounded buttons
  circle: '50%',   // Icon containers
} as const

/**
 * Shadow Definitions
 * Elevation system for depth and hierarchy
 */
export const shadows = {
  none: 'none',
  xs: '0 1px 3px rgba(0, 0, 0, 0.06)',
  sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
  md: '0 4px 12px rgba(0, 0, 0, 0.1)',
  lg: '0 6px 20px rgba(0, 0, 0, 0.15)',
  xl: '0 8px 32px rgba(0, 0, 0, 0.2)',
  button: '0 6px 20px rgba(134, 76, 189, 0.4)', // Gradient button hover
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const

/**
 * Button Variants
 * Pre-configured button styles matching design system
 */
export const buttonVariants = {
  primary: {
    background: brandGradients.primary,
    color: '#FFFFFF',
    padding: '14px 32px',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.full,
    border: 'none',
    transition: 'all 0.3s ease',
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: shadows.button,
    },
  },
  secondary: {
    background: brandColors.primary,
    color: '#FFFFFF',
    padding: '14px 32px',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.full,
    border: 'none',
    transition: 'all 0.3s ease',
    hover: {
      background: '#005A9C',
      transform: 'translateY(-2px)',
    },
  },
  outline: {
    background: 'transparent',
    color: brandColors.primary,
    padding: '12px 30px',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.full,
    border: `2px solid ${brandColors.primary}`,
    transition: 'all 0.3s ease',
    hover: {
      background: brandColors.primary,
      color: '#FFFFFF',
    },
  },
} as const

/**
 * Breakpoints for Responsive Design
 */
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/**
 * Animation Transitions
 */
export const transitions = {
  fast: '0.15s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
  button: '0.3s ease',
} as const

/**
 * Z-Index Scale
 * Consistent layering for UI elements
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
} as const

/**
 * Design System Usage Guidelines
 */
export const usageGuidelines = {
  do: [
    'Use the gradient for primary CTAs and hero elements',
    'Maintain generous white space for clean, modern feel',
    'Use Source Sans Pro consistently across all text',
    'Keep rounded corners (border-radius) for modern aesthetic',
    'Use soft, gradient backgrounds for icon containers',
  ],
  dont: [
    "Don't use sharp corners or boxy designs",
    "Don't overcrowd elements - embrace white space",
    "Don't use colors outside the defined palette",
    "Don't mix font families",
    "Don't create busy or cluttered layouts",
  ],
} as const

/**
 * Complete Brand Configuration Export
 */
export const brandConfig = {
  colors: brandColors,
  colorScales,
  gradients: brandGradients,
  typography,
  spacing,
  borderRadius,
  shadows,
  buttonVariants,
  breakpoints,
  transitions,
  zIndex,
  usageGuidelines,
} as const

export default brandConfig
