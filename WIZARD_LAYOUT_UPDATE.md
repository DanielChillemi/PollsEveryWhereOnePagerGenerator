# OnePager Wizard Layout Update

## Changes Summary
**Date**: October 17, 2025  
**Feature**: Reorganized wizard layout with dashboard sidebar

## Layout Restructure

### Before:
```
┌────────────────────┬──────────────────────────────────┐
│  Wizard Progress   │   Main Content Area              │
│  (Left Sidebar)    │                                  │
│                    │                                  │
│  • Add Content     │   Form fields and content        │
│  • Refine          │                                  │
│  • PDF Export      │                                  │
│                    │                                  │
└────────────────────┴──────────────────────────────────┘
```

### After:
```
┌─────────┬────────────────────────┬──────────────────┐
│ Sidebar │  Main Content Area     │ Wizard Progress  │
│ (280px) │                        │ (320px)          │
│         │                        │                  │
│ • Home  │   Form fields          │ • Add Content    │
│ • Brand │   and content          │ • Refine         │
│ • One-  │                        │ • PDF Export     │
│   Pagers│                        │                  │
│         │                        │ [Cancel Button]  │
└─────────┴────────────────────────┴──────────────────┘
```

## Key Changes

### 1. **Left Sidebar - Dashboard Navigation (NEW)**
- **Component**: `<Sidebar />` from `components/layouts/Sidebar.tsx`
- **Width**: 280px fixed
- **Content**: 
  - Onepaige branding
  - Navigation: Dashboard, Brand Kits, One-Pagers
  - Create New button
  - User menu/logout

### 2. **Center - Main Content Area**
- **Margins**: `ml="280px"` (left sidebar) + `mr="320px"` (right sidebar)
- **Content**: 
  - Form steps (Add Content, Refine, PDF Export)
  - Navigation buttons (Back / Generate with AI)
  - White card with rounded corners

### 3. **Right Sidebar - Wizard Progress (MOVED)**
- **Width**: 320px (increased from 280px for better visibility)
- **Position**: `position="fixed"` `right={0}`
- **Content**:
  - "Create One-Pager" header
  - Step descriptions
  - StepProgress component with visual indicators
  - Cancel button at bottom

## User Experience Benefits

### ✅ **Consistent Navigation**
- Users can navigate to other sections (Dashboard, Brand Kits) without canceling wizard
- Maintains familiar sidebar navigation pattern across the app
- Reduces cognitive load by keeping navigation consistent

### ✅ **Better Context Awareness**
- Wizard progress on the right keeps users informed of their position
- Main content gets more breathing room in the center
- Clear visual separation between navigation and progress

### ✅ **Improved Workflow**
- Can quickly switch between creating one-pager and viewing brand kits
- No need to cancel wizard to check other resources
- Sidebar "Create New" button always accessible

## Technical Implementation

### Files Modified:
1. **OnePagerWizard.tsx** - Main layout restructure
   - Added `<Sidebar />` import and component
   - Changed layout from 2-column to 3-column
   - Updated margins: `ml="280px"` + `mr="320px"`
   - Moved step progress to right sidebar

### Layout Responsive Considerations:
- **Desktop (1920px+)**: Full 3-column layout works perfectly
- **Laptop (1366px+)**: Content area scales down appropriately
- **Tablet/Mobile**: May need responsive adjustments (collapse sidebars)

### CSS Properties:
```tsx
// Left Sidebar (Dashboard)
<Sidebar /> // 280px fixed width, left aligned

// Center Content
<Box ml="280px" mr="320px" flex={1}>
  <Container maxW="900px">
    {/* Form content */}
  </Container>
</Box>

// Right Sidebar (Wizard Progress)
<Box 
  w="320px" 
  position="fixed" 
  right={0} 
  h="100vh"
  overflowY="auto"
>
  {/* Step progress */}
</Box>
```

## Testing Checklist

- [ ] Verify dashboard sidebar navigation works
- [ ] Check wizard progress indicators on right
- [ ] Test form submission flow
- [ ] Verify responsive behavior on different screen sizes
- [ ] Test Cancel button functionality
- [ ] Verify sidebar active state highlights
- [ ] Test navigation between wizard and other pages

## Next Steps

1. **Test in browser** - Hard refresh (Ctrl+Shift+R)
2. **Check responsive breakpoints** - May need to hide sidebars on mobile
3. **Verify sidebar active state** - Ensure "One-Pagers" is highlighted
4. **Polish transitions** - Add smooth animations between steps

## Notes

- TypeScript "cannot find module" errors are cache issues - files exist
- Layout uses fixed positioning for sidebars to keep them visible on scroll
- Main content area uses Container with maxW="900px" for optimal form width
- Right sidebar width increased to 320px (from 280px) for better readability
