# 🎯 Phase 2.3 Quick Start - One-Pager Creation Workflow

**Goal**: Complete the user experience from "Create" button to viewing generated one-pager in Smart Canvas

---

## 📊 What This Adds

**Before** (What we have now):
- ✅ Smart Canvas can **display** one-pagers
- ✅ Test page with **mock data**
- ❌ No way for users to **create** one-pagers
- ❌ No dashboard integration

**After** (What we'll build):
- ✅ Users can **create** one-pagers from dashboard
- ✅ Form to describe product/problem
- ✅ AI generates wireframe structure
- ✅ Results load directly into Smart Canvas
- ✅ Users can **save** and **manage** their one-pagers

---

## 🚀 User Journey We're Building

```
┌─────────────┐
│  Dashboard  │ ← User sees list of one-pagers
└──────┬──────┘
       │ Click "Create New"
       ↓
┌─────────────┐
│ Create Form │ ← Fill out product details
└──────┬──────┘
       │ Click "Generate with AI"
       ↓
┌─────────────┐
│   Loading   │ ← AI generates wireframe (10-30s)
└──────┬──────┘
       │ Generation complete
       ↓
┌─────────────┐
│   Canvas    │ ← Review generated one-pager
└──────┬──────┘
       │ Make edits, save, export
       ↓
┌─────────────┐
│  Dashboard  │ ← Back to list, see saved item
└─────────────┘
```

---

## 📋 Implementation Tasks (7 tasks)

### Phase 2.3A: Creation Form (2-3 hours)

**Task 1**: OnePagerCreatePage.tsx  
- Page with form container
- Loading overlay
- Error handling
- Route: `/onepager/create`

**Task 2**: CreateOnePagerForm.tsx  
- Form fields: title, product, problem, audience, brand kit
- Validation (title required, 10-2000 char prompt)
- Submit handler

**Task 3**: useOnePagerCreation.ts  
- API hook for POST /onepagers
- Transform backend → frontend
- Navigate to canvas on success

**Task 4**: OnePagerCanvasPage.tsx  
- Fetch one-pager by ID
- Load into Smart Canvas
- Save/Export buttons
- Route: `/onepager/:id`

---

### Phase 2.3B: Dashboard Integration (1-2 hours)

**Task 5**: Update DashboardPage.tsx  
- List user's one-pagers
- "Create New" button
- OnePagerCard components
- Empty state

**Task 6**: onePagerService.ts  
- API service layer
- TanStack Query hooks
- CRUD operations

---

### Phase 2.3C: Save & Persistence (1 hour)

**Task 7**: Save Functionality  
- Manual save button
- Auto-save (30 sec debounce)
- Save indicator (Saved/Saving/Unsaved)
- PUT /onepagers/:id

---

## 🎨 Key Components to Build

### 1. Create Form
```
┌──────────────────────────────────┐
│  Title: ________________         │
│                                   │
│  Product Description:             │
│  ┌─────────────────────────────┐ │
│  │ (large textarea)            │ │
│  └─────────────────────────────┘ │
│                                   │
│  Problem Statement:               │
│  ┌─────────────────────────────┐ │
│  │ (large textarea)            │ │
│  └─────────────────────────────┘ │
│                                   │
│  Target Audience: _________      │
│                                   │
│  Brand Kit: [Dropdown ▼]        │
│                                   │
│  [ Generate with AI → ]          │
└──────────────────────────────────┘
```

### 2. Dashboard List
```
┌──────────────────────────────────┐
│  Your One-Pagers  [+ Create New] │
│                                   │
│  ┌────┐  ┌────┐  ┌────┐         │
│  │ #1 │  │ #2 │  │ #3 │         │
│  │📄 │  │📄 │  │📄 │         │
│  └────┘  └────┘  └────┘         │
└──────────────────────────────────┘
```

### 3. Canvas with Actions
```
┌──────────────────────────────────┐
│ Title  [💾 Saved] [Export] [Back]│
│ Wireframe ⟷ Styled  - [100%] +  │
├──────────────────────────────────┤
│  [Smart Canvas Content]           │
└──────────────────────────────────┘
```

---

## 🔧 Technical Stack

**New Dependencies**:
```bash
npm install react-hook-form zod @hookform/resolvers
```

**API Endpoints** (Already exist in backend):
- `POST /api/v1/onepagers` - Create
- `GET /api/v1/onepagers` - List
- `GET /api/v1/onepagers/:id` - Get one
- `PUT /api/v1/onepagers/:id` - Update
- `DELETE /api/v1/onepagers/:id` - Delete

**State Management**:
- TanStack Query for server state
- Zustand onePagerStore for canvas state
- React Hook Form for form state

---

## ✅ Acceptance Criteria

Phase 2.3 is complete when:

1. ✅ User clicks "Create New One-Pager" from dashboard
2. ✅ Form validates input (title required, prompt 10-2000 chars)
3. ✅ Submit calls API with loading indicator
4. ✅ AI generation works (shows progress)
5. ✅ Generated one-pager loads in Smart Canvas
6. ✅ User can toggle wireframe/styled modes
7. ✅ Save button persists changes to backend
8. ✅ Auto-save works (every 30 seconds)
9. ✅ Dashboard shows list of all one-pagers
10. ✅ Clicking card opens in canvas

---

## 📅 Estimated Timeline

**Session 1** (2-3 hours): Tasks 1-4  
- Build creation form
- API integration
- Canvas page

**Session 2** (1-2 hours): Tasks 5-6  
- Dashboard integration
- List view
- API service layer

**Session 3** (1 hour): Task 7  
- Save functionality
- Auto-save
- Polish

**Total**: 4-6 hours over 2-3 sessions

---

## 🚀 Ready to Start?

**Next Action**: Build Task 1 - OnePagerCreatePage.tsx

Would you like me to:
1. **Start implementing** Task 1 now?
2. **Review the plan** and make adjustments?
3. **Break down** Task 1 into smaller steps?

Let me know and we'll get started! 🎨✨
