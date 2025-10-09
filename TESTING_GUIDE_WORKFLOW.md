# One-Pager Workflow - Quick Testing Guide

**Date**: October 8, 2025  
**Status**: Ready for Testing  
**Estimated Testing Time**: 15-20 minutes

---

## 🚀 Prerequisites

### 1. Start Backend Server
```bash
cd backend
source ../.venv/bin/activate  # Windows: .venv\Scripts\activate
uvicorn main:app --reload
```
✅ Server running at http://localhost:8000

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
✅ Frontend running at http://localhost:5173

---

## ✅ Test Flow: Complete User Journey

### Step 1: Dashboard (Starting Point)
**URL:** http://localhost:5173/dashboard

**Verify:**
- [ ] Dashboard loads successfully
- [ ] User name displayed in header
- [ ] "Create New One-Pager" button visible
- [ ] "Your One-Pagers" section visible

**Actions:**
1. Click **"+ New One-Pager"** button
2. Should navigate to `/onepager/create`

---

### Step 2: Creation Form
**URL:** http://localhost:5173/onepager/create

**Verify:**
- [ ] Form displays with all fields
- [ ] Brand Kit dropdown populated (if you have brand kits)
- [ ] Target Audience dropdown populated (from brand kit)
- [ ] All required fields marked

**Actions:**
1. Fill in the form:
   - **Title**: "Test Product Launch"
   - **Product**: "A revolutionary SaaS platform for team collaboration"
   - **Problem**: "Remote teams struggle with async communication and document organization"
   - **Target Audience**: Select from dropdown (or type manually)
   - **Brand Kit**: Select your brand kit
2. Click **"Generate with AI"**

**Verify During Generation:**
- [ ] Loading overlay appears
- [ ] Spinner visible
- [ ] "Creating Your One-Pager" message
- [ ] "AI is analyzing..." status text
- [ ] "This may take 10-30 seconds" warning

**Wait:** 10-30 seconds for AI generation

---

### Step 3: Canvas Page (Automatic Navigation)
**URL:** http://localhost:5173/onepager/[generated-id]

**Verify Header:**
- [ ] One-pager title displayed correctly
- [ ] Status badge shows "wireframe" or "draft"
- [ ] Brand kit name displayed (if selected)
- [ ] "Saved" status indicator visible
- [ ] Save button present (disabled initially)
- [ ] "Export PDF" button present
- [ ] "Export to Canva" button present
- [ ] "← Dashboard" button present

**Verify Canvas:**
- [ ] Smart Canvas renders the one-pager
- [ ] Elements display based on AI generation
- [ ] Toolbar shows mode toggle (Wireframe/Styled)
- [ ] Zoom controls (+/-) present
- [ ] Content is readable

---

### Step 4: Test Canvas Interactions

**4A. Mode Toggle:**
1. Click **"Styled"** button in toolbar
2. **Verify:** Canvas applies brand colors/fonts
3. Click **"Wireframe"** button
4. **Verify:** Returns to wireframe view

**4B. Zoom Controls:**
1. Click **"+"** button 3 times
2. **Verify:** Canvas zooms in
3. Click **"-"** button 3 times
4. **Verify:** Canvas zooms out

**4C. Element Selection:**
1. Click any section in the canvas
2. **Verify:** Blue outline appears around element
3. **Verify:** Selection persists

---

### Step 5: Test Save Functionality

**5A. Manual Save:**
1. Make a small edit (if possible) or just click **"Save"**
2. **Verify:** Button shows "Saving..." with spinner
3. **Wait** 2 seconds
4. **Verify:** 
   - Button returns to "Save" (disabled)
   - "Saved [timestamp]" appears in header
   - Timestamp shows current time

**5B. Auto-Save (Optional - Takes 30 seconds):**
1. Make an edit in canvas
2. **Wait** 30 seconds without clicking save
3. **Verify:** "Saving..." appears automatically
4. **Verify:** "Saved" status updates with new timestamp

**5C. Unsaved Changes Warning:**
1. Click **"← Dashboard"**
2. **Verify:** Confirmation dialog appears
3. **Verify:** Message mentions unsaved changes
4. Click **"Cancel"** to stay on page

---

### Step 6: Test PDF Export

**6A. Export to PDF:**
1. Click **"Export PDF"** button
2. **Verify:** Button shows spinner during export
3. **Wait** 3-5 seconds
4. **Verify:** PDF file downloads automatically

**6B. Verify PDF Quality:**
1. Open downloaded PDF in PDF viewer
2. **Verify:** 
   - Content matches canvas
   - Layout is correct
   - Text is readable
   - Colors applied (if in styled mode)
   - Filename contains one-pager title

---

### Step 7: Back to Dashboard

**7A. Navigate Back:**
1. Click **"← Dashboard"** button
2. **Verify:** Returns to `/dashboard`

**7B. Verify One-Pager Appears:**
- [ ] "Your One-Pagers" section shows new one-pager
- [ ] Card displays correct title
- [ ] Status badge correct
- [ ] "Updated [time]" shows recent timestamp
- [ ] Brand kit indicator present (if applicable)

**7C. Re-open from Dashboard:**
1. Click on the one-pager card
2. **Verify:** Navigates back to canvas page
3. **Verify:** Same content loads
4. **Verify:** Save status shows "Saved"

---

### Step 8: Create Multiple One-Pagers

**8A. Create Second One-Pager:**
1. From dashboard, click **"+ New One-Pager"**
2. Fill form with different data
3. Generate and verify canvas loads

**8B. Verify Dashboard List:**
1. Return to dashboard
2. **Verify:** Both one-pagers appear in list
3. **Verify:** Most recent is listed first

---

## 🐛 Error Scenario Testing

### Test Invalid One-Pager ID
1. Manually navigate to http://localhost:5173/onepager/invalid-id-123
2. **Verify:** 
   - Error alert appears
   - "Failed to Load One-Pager" message
   - "Back to Dashboard" button works

### Test Without Authentication
1. Log out
2. Try accessing http://localhost:5173/onepager/create
3. **Verify:** Redirects to login page

---

## 📊 Success Criteria

### All Tests Pass If:
- [x] Can create one-pager from dashboard
- [x] Form submits and generates AI content
- [x] Navigates automatically to canvas
- [x] Canvas renders generated content
- [x] Save functionality works (manual + auto)
- [x] PDF export generates downloadable file
- [x] Back navigation works
- [x] One-pager appears in dashboard list
- [x] Can re-open from dashboard
- [x] Error states handled gracefully

---

## 🔍 What to Look For

### Console Logs (Expected)
```
✅ Submitting one-pager creation request: {...}
✅ OnePager created successfully
✅ Navigating to canvas: /onepager/[id]
✅ Fetching one-pager...
✅ One-pager loaded into store
✅ Saving one-pager...
✅ Save successful
✅ PDF exported successfully
```

### Console Errors (Fix If You See)
```
❌ Failed to create one-pager
❌ Failed to fetch one-pager
❌ Failed to save
❌ Failed to export PDF
❌ 401 Unauthorized
```

---

## 📝 Report Issues

If you encounter any issues, note:
1. **What step** were you on?
2. **What action** did you take?
3. **What happened** vs. what was expected?
4. **Console errors** (if any)
5. **Network tab** status codes

---

## 🎉 Testing Complete!

If all steps pass, the workflow is ready for production! 🚀

**Next Steps:**
1. Test on different browsers (Chrome, Firefox, Safari)
2. Test on mobile devices
3. Test with slow network (throttle in DevTools)
4. Test with multiple users
5. Deploy to staging environment

---

**Happy Testing!** 🧪
