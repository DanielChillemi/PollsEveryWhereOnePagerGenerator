/**
 * Layout Parameters to CSS Variables Utility
 *
 * Converts LayoutParams to CSS custom properties for dynamic styling.
 */

import type { LayoutParams } from '../types/onepager';

/**
 * Convert LayoutParams to CSS custom properties object
 *
 * @param layoutParams - Layout parameters to convert
 * @returns Object with CSS custom property names as keys
 */
export function layoutParamsToCSSVariables(
  layoutParams: LayoutParams | null | undefined
): Record<string, string> {
  if (!layoutParams) {
    // Return default values
    return {
      '--layout-h1-scale': '1.0',
      '--layout-h2-scale': '1.0',
      '--layout-body-scale': '1.0',
      '--layout-line-height-scale': '1.0',
      '--layout-padding-scale': '1.0',
      '--layout-section-gap': '20px', // default/normal
    };
  }

  const { typography, spacing } = layoutParams;

  // Map section_gap values to pixel values
  const sectionGapMap = {
    tight: '12px',
    normal: '20px',
    loose: '32px',
  };

  return {
    // Typography scales
    '--layout-h1-scale': typography.h1_scale.toString(),
    '--layout-h2-scale': typography.h2_scale.toString(),
    '--layout-body-scale': typography.body_scale.toString(),
    '--layout-line-height-scale': typography.line_height_scale.toString(),

    // Spacing scales
    '--layout-padding-scale': spacing.padding_scale.toString(),
    '--layout-section-gap': sectionGapMap[spacing.section_gap] || sectionGapMap.normal,
  };
}

/**
 * Apply layout parameters as inline styles to an element
 *
 * @param layoutParams - Layout parameters to apply
 * @returns Style object for React components
 */
export function applyLayoutParamsAsStyles(
  layoutParams: LayoutParams | null | undefined
): React.CSSProperties {
  const cssVars = layoutParamsToCSSVariables(layoutParams);

  return cssVars as React.CSSProperties;
}
