# Brand Kit UI Fixes - Professional Layout & Spacing

## Issues Found

### 1. **Field Spacing Problems**
- Input fields have inconsistent internal padding
- Gap between form sections too tight (using gap={3} and gap={4} instead of semantic spacing)
- Color picker elements cramped together
- Font selector preview box needs more breathing room

### 2. **Layout Centering Issues**
- Form container lacks proper max-width constraint
- Content stretches to full container width instead of centering
- Missing proper horizontal padding for responsive behavior
- Form sections don't follow centered column layout

### 3. **Professional Polish Missing**
- Input fields need more height (current 48px should be 56px for better touch targets)
- Missing subtle shadows and depth
- Border radius inconsistent (should follow 12px/16px system)
- Typography hierarchy not strong enough
- Section dividers too thin and gray

## Poll Everywhere Design System Reference

From `poll-everywhere-design-system.html`:

### Spacing Scale
- **XS**: 8px (tight spacing)
- **SM**: 16px (default spacing)
- **MD**: 24px (section spacing)
- **LG**: 32px (large section spacing)
- **XL**: 48px (major section breaks)
- **XXL**: 64px (page-level spacing)

### Component Standards
- **Input Height**: 56px for better accessibility
- **Border Radius**: 12px for form elements, 16px for cards
- **Padding**: Generous padding (24px-32px for cards)
- **Shadows**: Soft shadows (0 4px 24px rgba(0, 0, 0, 0.08))
- **Max Width**: 800px for form content, centered in container

### Typography
- **Section Headings**: 24px, weight 700
- **Subsection Headings**: 18px, weight 600  
- **Body Text**: 16px, weight 400
- **Helper Text**: 14px, weight 400

## Required Fixes

### Fix 1: BrandKitForm Layout Container
- Wrap form in centered container with max-width 800px
- Increase vertical spacing between sections (gap={10} = 40px)
- Make inputs taller (56px instead of 48px)
- Increase section divider thickness and add subtle color

### Fix 2: ColorPicker Spacing
- Increase gap between color swatch and hex input (gap={4} = 16px)
- Add more padding to color section (24px)
- Make color swatches slightly larger (64px x 48px)

### Fix 3: Input Fields
- Standardize all input heights to 56px
- Increase border radius to 12px
- Add subtle box shadow on focus
- Increase internal padding for better readability

### Fix 4: FormSection Component
- Increase gap between title and content (gap={6} = 24px)
- Add stronger typography hierarchy
- Better description text styling

### Fix 5: Page Layout Centering
- BrandKitCreatePage container should be maxW="900px" (allows 800px form + padding)
- Add proper horizontal padding responsive to screen size
- Increase vertical spacing around form (py={16})

## Implementation Plan

1. Update FormSection typography and spacing
2. Fix Input field heights and styling across all components
3. Update BrandKitForm main container spacing
4. Add proper centering to page layouts
5. Enhance visual polish (shadows, borders, colors)
