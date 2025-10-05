/**
 * Brand Utilities
 * 
 * Helper functions for applying Poll Everywhere brand styles
 * throughout the application.
 */

import { brandConfig } from '../config/brandConfig'

/**
 * Get CSS custom properties for theming
 * Use this to generate CSS variables for dynamic theming
 */
export const getCSSVariables = () => {
  return {
    '--color-primary': brandConfig.colors.primary,
    '--color-purple': brandConfig.colors.purple,
    '--color-deep-blue': brandConfig.colors.deepBlue,
    '--color-background': brandConfig.colors.background,
    '--color-text': brandConfig.colors.text,
    '--color-text-light': brandConfig.colors.textLight,
    '--color-text-dark': brandConfig.colors.textDark,
    '--color-border': brandConfig.colors.border,
    '--color-background-gray': brandConfig.colors.backgroundGray,
    '--color-background-blue': brandConfig.colors.backgroundBlue,
    '--gradient-primary': brandConfig.gradients.primary,
  }
}

/**
 * Apply gradient text effect
 * Creates a gradient text color effect
 */
export const gradientTextStyle = {
  background: brandConfig.gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
}

/**
 * Get button styles by variant
 */
export const getButtonStyles = (variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
  return brandConfig.buttonVariants[variant]
}

/**
 * Generate card container styles
 */
export const cardStyles = {
  background: brandConfig.colors.background,
  borderRadius: brandConfig.borderRadius.lg,
  boxShadow: brandConfig.shadows.md,
  padding: brandConfig.spacing.md,
  transition: brandConfig.transitions.normal,
}

/**
 * Generate section container styles
 */
export const sectionStyles = {
  padding: `${brandConfig.spacing.xxl} ${brandConfig.spacing.md}`,
  maxWidth: '1200px',
  margin: '0 auto',
}

/**
 * Heading styles by level
 */
export const headingStyles = {
  h1: {
    fontSize: brandConfig.typography.fontSize['4xl'],
    fontWeight: brandConfig.typography.fontWeight.bold,
    lineHeight: brandConfig.typography.lineHeight.tight,
    color: brandConfig.colors.textDark,
  },
  h2: {
    fontSize: brandConfig.typography.fontSize['3xl'],
    fontWeight: brandConfig.typography.fontWeight.bold,
    color: brandConfig.colors.textDark,
  },
  h3: {
    fontSize: brandConfig.typography.fontSize['2xl'],
    fontWeight: brandConfig.typography.fontWeight.semibold,
    color: brandConfig.colors.textDark,
  },
}

/**
 * Body text styles
 */
export const bodyTextStyles = {
  fontSize: brandConfig.typography.fontSize.lg,
  lineHeight: brandConfig.typography.lineHeight.normal,
  color: brandConfig.colors.text,
}

/**
 * Stats display styles
 */
export const statsStyles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: brandConfig.spacing.lg,
    padding: brandConfig.spacing.xl,
    background: brandConfig.colors.backgroundBlue,
    borderRadius: brandConfig.borderRadius.lg,
  },
  number: {
    fontSize: brandConfig.typography.fontSize['5xl'],
    fontWeight: brandConfig.typography.fontWeight.bold,
    color: brandConfig.colors.primary,
  },
  label: {
    fontSize: brandConfig.typography.fontSize.lg,
    color: brandConfig.colors.textLight,
    fontWeight: brandConfig.typography.fontWeight.semibold,
  },
}

/**
 * Input field styles
 */
export const inputStyles = {
  base: {
    fontFamily: brandConfig.typography.fontFamily.base,
    fontSize: brandConfig.typography.fontSize.md,
    padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
    borderRadius: brandConfig.borderRadius.md,
    border: `1px solid ${brandConfig.colors.border}`,
    transition: brandConfig.transitions.fast,
  },
  focus: {
    borderColor: brandConfig.colors.primary,
    outline: `2px solid ${brandConfig.colorScales.blue[200]}`,
    outlineOffset: '2px',
  },
  error: {
    borderColor: '#dc3545',
    outline: '2px solid rgba(220, 53, 69, 0.2)',
  },
}

/**
 * Navigation bar styles
 */
export const navStyles = {
  container: {
    background: brandConfig.colors.background,
    borderBottom: `1px solid ${brandConfig.colors.border}`,
    padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
    boxShadow: brandConfig.shadows.sm,
  },
  link: {
    color: brandConfig.colors.text,
    fontSize: brandConfig.typography.fontSize.md,
    fontWeight: brandConfig.typography.fontWeight.semibold,
    transition: brandConfig.transitions.fast,
  },
  linkHover: {
    color: brandConfig.colors.primary,
  },
}

/**
 * Modal styles
 */
export const modalStyles = {
  overlay: {
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
  },
  content: {
    background: brandConfig.colors.background,
    borderRadius: brandConfig.borderRadius.xl,
    boxShadow: brandConfig.shadows.xl,
    padding: brandConfig.spacing.xl,
    maxWidth: '600px',
    margin: '0 auto',
  },
}

/**
 * Alert/Toast styles
 */
export const alertStyles = {
  success: {
    background: '#d4edda',
    color: '#155724',
    borderLeft: `4px solid #28a745`,
    padding: brandConfig.spacing.md,
    borderRadius: brandConfig.borderRadius.md,
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    borderLeft: `4px solid #dc3545`,
    padding: brandConfig.spacing.md,
    borderRadius: brandConfig.borderRadius.md,
  },
  info: {
    background: '#d1ecf1',
    color: '#0c5460',
    borderLeft: `4px solid ${brandConfig.colors.primary}`,
    padding: brandConfig.spacing.md,
    borderRadius: brandConfig.borderRadius.md,
  },
}

/**
 * Loading spinner styles
 */
export const spinnerStyles = {
  border: `4px solid ${brandConfig.colors.backgroundGray}`,
  borderTop: `4px solid ${brandConfig.colors.primary}`,
  borderRadius: brandConfig.borderRadius.circle,
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
}

/**
 * Responsive utilities
 */
export const getResponsiveValue = <T,>(
  values: { xs?: T; sm?: T; md?: T; lg?: T; xl?: T }
): T | undefined => {
  // This would be used with a media query hook to return the appropriate value
  // based on the current screen size
  return values.md // Default to medium
}

/**
 * Color manipulation utilities
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Export all utilities
 */
export const brandUtils = {
  getCSSVariables,
  gradientTextStyle,
  getButtonStyles,
  cardStyles,
  sectionStyles,
  headingStyles,
  bodyTextStyles,
  statsStyles,
  inputStyles,
  navStyles,
  modalStyles,
  alertStyles,
  spinnerStyles,
  getResponsiveValue,
  hexToRgba,
}

export default brandUtils
