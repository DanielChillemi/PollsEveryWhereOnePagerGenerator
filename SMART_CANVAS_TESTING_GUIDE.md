# Smart Canvas Testing Guide

**Created**: October 8, 2025  
**Status**: Phase 2.2A Complete - Ready for Testing  
**Server**: Running at http://localhost:5173

---

## 🎉 Implementation Complete!

All 10 tasks of Phase 2.2A are now complete. The Smart Canvas is fully integrated and ready for testing.

---

## 🚀 Quick Start Testing

### 1. Access the Test Page

The dev server is running at: **http://localhost:5173**

Navigate to: **http://localhost:5173/canvas-test**

> **Note**: You'll need to log in first since it's a protected route.
> - If you don't have an account, go to `/signup` first
> - Then navigate to `/canvas-test`

---

## 🧪 Testing Checklist

### ✅ Basic Functionality

- [ ] **Page Loads** - Canvas test page renders without errors
- [ ] **Load Full Mock** - Click "Load Full Mock (9 elements)" button
  - Should load complete one-pager with all element types
  - Status should show "Loaded" with "Elements: 9"
- [ ] **Load Minimal Mock** - Click "Load Minimal Mock (3 elements)"
  - Should load simple one-pager
  - Status should show "Elements: 3"
- [ ] **Clear Canvas** - Click "Clear Canvas" button
  - Should show empty canvas with placeholder message
  - Status should show "Loaded" with "Elements: 0"

### ✅ Toolbar Controls

- [ ] **Mode Toggle** - Click the Wireframe/Styled switch
  - **Wireframe Mode**: Elements should be grayscale (#E2E8F0 background)
  - **Styled Mode**: Elements should show colors from styling properties
  - Toggle should update immediately
- [ ] **Zoom In** - Click the "+" button
  - Canvas should zoom in (max 200%)
  - Percentage should update
  - Content should scale smoothly
- [ ] **Zoom Out** - Click the "-" button
  - Canvas should zoom out (min 50%)
  - Percentage should update
- [ ] **Zoom Display** - Center button shows current zoom %
  - Click to reset to 100%

### ✅ Element Interactions

- [ ] **Element Selection** - Click any element in the canvas
  - Selected element should get blue 3px solid outline
  - "Selected" status should show element ID
  - Debug panel should highlight selected element
- [ ] **Hover Effects** - Hover over elements (without clicking)
  - Should show dashed outline on hover
  - Cursor should change to pointer
- [ ] **Multiple Selections** - Click different elements
  - Previous selection should deselect
  - New selection should highlight
  - Only one element selected at a time

### ✅ Element Rendering

Test that all 9 element types render correctly:

- [ ] **Hero** (hero-001)
  - Headline: "Transform Your Marketing with AI"
  - Subheadline and description visible
  - CTA button present
  - Styled mode: blue background (#667eea), white text
- [ ] **Heading** (heading-001, heading-002)
  - Text: "The Challenge" and "How It Works"
  - Properly sized (h2)
  - Centered alignment
- [ ] **Text** (text-001, text-002)
  - Paragraph content renders
  - Readable font size
- [ ] **Features** (features-001)
  - Title: "Key Features"
  - 4 feature items render as list
- [ ] **List** (list-001)
  - 5 process steps visible
  - Bullet points or numbering
- [ ] **CTA** (cta-001)
  - Headline: "Ready to Transform..."
  - Styled mode: light gray background
- [ ] **Button** (button-001)
  - Text: "Contact Sales"
  - Clickable appearance
- [ ] **Image** (image-001)
  - Placeholder image loads
  - Caption: "Real-time preview and editing"

### ✅ History Management

- [ ] **Undo** - Click "Undo" button (after making changes)
  - Should be disabled initially (no history)
  - Enable after element modifications (future feature)
- [ ] **Redo** - Click "Redo" button
  - Should be disabled when at latest state
  - Enable after undo operation

### ✅ Debug Panel

- [ ] **Current State** - JSON display shows:
  - Correct ID, title, element count
  - Element types array matches loaded data
  - Selected element updates on click
- [ ] **Element List** - Shows all elements:
  - Number, type, and ID for each
  - Selected element highlighted in blue
  - Order numbers match

### ✅ Responsive Behavior

- [ ] **Scroll** - Canvas scrolls when content exceeds viewport
- [ ] **Fixed Toolbar** - Toolbar stays at top when scrolling
- [ ] **Container Width** - 1080px canvas width maintained
- [ ] **Zoom Transform** - Scale applied correctly to entire canvas

---

## 🐛 Known Issues to Watch For

### Potential Problems

1. **Auth Redirect** - If not logged in, you'll be redirected to `/login`
   - Solution: Create account or log in first

2. **TypeScript Errors** - If you see console errors about types
   - Check browser console (F12)
   - Report any type mismatches

3. **Chakra UI v3 Warnings** - Some components might have deprecation warnings
   - Note which components show warnings
   - Check if functionality still works

4. **Selection Not Working** - If elements don't highlight on click
   - Check console for onClick handler errors
   - Verify canvasStore is updating

5. **Mode Toggle Not Switching** - If wireframe/styled doesn't change
   - Check Switch component in toolbar
   - Verify canvasStore mode is updating

6. **Zoom Not Working** - If +/- buttons don't change scale
   - Check transform CSS is being applied
   - Verify zoom value updates in store

---

## 📊 Performance Testing

### Metrics to Monitor

- [ ] **Initial Load Time** - Page should load in < 1 second
- [ ] **Mode Toggle Speed** - Should be instant (< 100ms)
- [ ] **Zoom Response** - Should be smooth, no lag
- [ ] **Element Selection** - Instant highlight on click
- [ ] **Scroll Performance** - Smooth scrolling, no jank

### Browser Console

Open Dev Tools (F12) and check:

- **Console Tab** - No errors (warnings okay)
- **Network Tab** - All assets load successfully
- **Performance Tab** - No long tasks or janky frames

---

## ✍️ Manual Testing Notes

### What to Test

1. **Load each mock data set** and verify visual rendering
2. **Toggle between modes** multiple times (wireframe ↔ styled)
3. **Zoom in and out** to extremes (50%, 200%)
4. **Click every element** to test selection
5. **Scroll the canvas** up and down
6. **Resize browser window** to test responsiveness

### What to Document

For each test, note:
- ✅ **Pass** - Works as expected
- ⚠️ **Warning** - Works but has minor issues
- ❌ **Fail** - Does not work, blocks testing

**Example**:
```
✅ Mode Toggle - Works perfectly, instant switch
⚠️ Image Element - Loads but placeholder is slow
❌ Zoom to 200% - Canvas overflows container
```

---

## 🎯 Success Criteria

Phase 2.2A is successful if:

- ✅ All 9 element types render visibly
- ✅ Mode toggle switches styling (wireframe ↔ styled)
- ✅ Zoom controls adjust canvas scale (50%-200%)
- ✅ Element selection highlights with blue outline
- ✅ No blocking TypeScript or runtime errors
- ✅ Toolbar stays fixed during scroll
- ✅ Debug panel updates correctly
- ✅ Performance is acceptable (no major lag)

---

## 🔧 Troubleshooting

### Dev Server Won't Start

```bash
cd frontend
npm install  # Reinstall dependencies
npm run dev  # Try again
```

### Port Already in Use

```bash
# Kill existing process
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
npm run dev
```

### TypeScript Errors in Browser

```bash
cd frontend
npm run type-check  # Check for type errors
npm run lint        # Check for lint errors
```

### Can't Access /canvas-test

1. Make sure you're logged in
2. Navigate to http://localhost:5173/canvas-test
3. Check browser console for route errors
4. Verify App.tsx has CanvasTestPage import and route

---

## 📝 Test Results Template

Copy and fill out after testing:

```markdown
## Smart Canvas Test Results

**Date**: October 8, 2025
**Tester**: [Your Name]
**Browser**: [Chrome/Firefox/Safari] [Version]
**OS**: Windows 11

### Basic Functionality
- [ ] Page loads: Pass/Fail
- [ ] Load full mock: Pass/Fail
- [ ] Load minimal mock: Pass/Fail
- [ ] Clear canvas: Pass/Fail

### Toolbar Controls
- [ ] Mode toggle: Pass/Fail
- [ ] Zoom in: Pass/Fail
- [ ] Zoom out: Pass/Fail

### Element Rendering
- [ ] Hero: Pass/Fail
- [ ] Headings: Pass/Fail
- [ ] Text: Pass/Fail
- [ ] Features: Pass/Fail
- [ ] List: Pass/Fail
- [ ] CTA: Pass/Fail
- [ ] Button: Pass/Fail
- [ ] Image: Pass/Fail

### Issues Found
1. [Issue description]
2. [Issue description]

### Overall Assessment
[Pass/Fail] - [Brief summary]
```

---

## 🚀 Next Steps After Testing

### If All Tests Pass

1. **Document Results** - Fill out test results template
2. **Take Screenshots** - Capture wireframe and styled modes
3. **Commit Changes** - Use git commit guide
4. **Create PR** - Open draft pull request
5. **Begin Phase 2.2B** - Implement drag-and-drop and real editing

### If Tests Fail

1. **Document Failures** - Note specific issues and steps to reproduce
2. **Check Console** - Copy error messages
3. **Debug Components** - Use React DevTools to inspect state
4. **Fix Issues** - Address blocking problems
5. **Retest** - Repeat testing checklist

---

## 🎓 Learning Points

### For Marketing Teams

- **Wireframe Mode** = Structure and content validation (grayscale)
- **Styled Mode** = Brand application and visual design (colors)
- **Element Selection** = Click to focus and edit (future feature)
- **Zoom** = Detail work vs. overview perspective

### For Developers

- **Type-Safe State** = Zustand stores with TypeScript interfaces
- **Component Composition** = ElementRenderer dispatches to specific components
- **CSS-in-JS** = Chakra UI v3 with dynamic styling
- **Error Boundaries** = Graceful failure handling with retry

---

## 📞 Support

**Issues?** Report in project Slack or GitHub issues:
- Include browser console output
- Provide steps to reproduce
- Attach screenshots if visual issue

**Questions?** See documentation:
- `SMART_CANVAS_SESSION_SUMMARY.md` - Full implementation details
- `SMART_CANVAS_QUICK_REF.md` - Quick reference
- `GIT_COMMIT_GUIDE_CANVAS.md` - Git workflow

---

**Happy Testing! 🎉**

The Smart Canvas is ready for you to explore. Test thoroughly and document your findings!
