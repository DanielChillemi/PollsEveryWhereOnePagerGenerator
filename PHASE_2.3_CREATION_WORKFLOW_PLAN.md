# Phase 2.3: One-Pager Creation Workflow - Implementation Plan

**Created**: October 8, 2025  
**Status**: Planning Phase  
**Estimated Time**: 4-6 hours  
**Priority**: HIGH - Completes end-to-end user experience

---

## 🎯 Objective

Build the complete user workflow from "Create One-Pager" button to viewing/editing the generated result in the Smart Canvas.

**User Journey**:
```
Dashboard → Click "Create New One-Pager" 
→ Fill out creation form (product, problem, audience)
→ Click "Generate with AI" 
→ Backend generates wireframe structure
→ Load result into Smart Canvas
→ User reviews/iterates
→ Save changes
→ Export PDF
```

---

## 📊 Current State Analysis

### ✅ What We Have

**Backend (Ready)**:
- ✅ `POST /api/v1/onepagers` - Create endpoint with AI generation
- ✅ `GET /api/v1/onepagers` - List user's one-pagers
- ✅ `GET /api/v1/onepagers/{id}` - Get specific one-pager
- ✅ `ai_service.generate_initial_wireframe()` - AI generation logic
- ✅ Brand Kit integration in generation
- ✅ MongoDB storage and retrieval

**Frontend (Ready)**:
- ✅ Smart Canvas rendering system
- ✅ Type definitions with transformers
- ✅ State management (onePagerStore, canvasStore)
- ✅ Auth system with protected routes
- ✅ Dashboard with user info

### ❌ What's Missing

**Frontend Gaps**:
- ❌ One-Pager creation form page
- ❌ Form validation and submission
- ❌ API integration for creation
- ❌ Loading states during AI generation
- ❌ Error handling for generation failures
- ❌ Dashboard integration (list, create buttons)
- ❌ Navigation from creation → canvas
- ❌ Save/update functionality

---

## 🏗️ Architecture Overview

### Component Structure

```
Dashboard
├── OnePagerListSection (new)
│   ├── EmptyState → "Create First One-Pager" button
│   └── OnePagerCard[] → List existing one-pagers
│
└── CreateOnePagerButton → Navigate to /onepager/create

OnePagerCreatePage (new)
├── CreateOnePagerForm
│   ├── TitleInput
│   ├── ProductDescriptionTextarea
│   ├── ProblemStatementTextarea
│   ├── TargetAudienceInput
│   ├── BrandKitSelector (dropdown)
│   └── GenerateButton
│
└── LoadingState → AI generation in progress

OnePagerCanvasPage (new)
├── CanvasToolbar (existing)
├── SmartCanvas (existing)
└── ActionButtons
    ├── SaveButton
    ├── ExportButton
    └── BackToDashboardButton
```

### Data Flow

```
User Input (Form)
    ↓
Frontend Validation
    ↓
POST /api/v1/onepagers
    ↓
Backend AI Generation
    ↓
OnePager Document (MongoDB)
    ↓
Response with OnePager ID
    ↓
Navigate to /onepager/:id
    ↓
Load into Smart Canvas
    ↓
User Reviews/Edits
    ↓
Save Changes (PUT)
    ↓
Export PDF (POST)
```

---

## 📋 Implementation Tasks

### Phase 2.3A: Creation Form (2-3 hours)

#### Task 1: Create OnePagerCreatePage Component
**File**: `frontend/src/pages/OnePagerCreatePage.tsx`

**Features**:
- Page layout with header
- Form container
- Loading overlay during generation
- Error message display
- Success redirect to canvas

**Acceptance Criteria**:
- ✅ Page renders at `/onepager/create`
- ✅ Protected route (requires auth)
- ✅ Shows loading state during API call
- ✅ Displays errors gracefully
- ✅ Redirects to canvas on success

---

#### Task 2: Build CreateOnePagerForm Component
**File**: `frontend/src/components/onepager/CreateOnePagerForm.tsx`

**Form Fields**:
```typescript
interface OnePagerFormData {
  title: string;              // Required, 3-100 chars
  input_prompt: string;       // Required, 10-2000 chars
  target_audience?: string;   // Optional, max 200 chars
  brand_kit_id?: string;      // Optional, from dropdown
}
```

**Validation Rules**:
- Title: Required, 3-100 characters
- Input Prompt: Required, 10-2000 characters (combines product + problem)
- Target Audience: Optional, max 200 characters
- Brand Kit: Optional, select from user's brand kits

**UI Components**:
- Text input for title
- Large textarea for product description
- Large textarea for problem statement
- Input for target audience
- Dropdown for brand kit selection
- Generate button (primary, disabled during loading)

**Acceptance Criteria**:
- ✅ All fields validated on blur and submit
- ✅ Clear error messages below each field
- ✅ Brand Kit dropdown loads user's kits
- ✅ Submit disabled until required fields valid
- ✅ Loading spinner on generate button

---

#### Task 3: Create API Integration Hook
**File**: `frontend/src/hooks/useOnePagerCreation.ts`

**API Functions**:
```typescript
export function useOnePagerCreation() {
  const createOnePager = useMutation({
    mutationFn: async (data: OnePagerFormData) => {
      const response = await api.post('/onepagers', data);
      return response.data;
    },
    onSuccess: (onepager) => {
      // Transform backend → frontend format
      const frontendOnePager = backendToFrontend(onepager);
      // Navigate to canvas
      navigate(`/onepager/${onepager._id}`);
    },
    onError: (error) => {
      // Show error toast/message
    }
  });

  return { createOnePager, isLoading, error };
}
```

**Features**:
- Uses TanStack Query for API calls
- Transforms backend response to frontend format
- Handles loading and error states
- Navigates to canvas on success
- Shows toast notifications

**Acceptance Criteria**:
- ✅ POST request to `/api/v1/onepagers`
- ✅ Includes auth token in headers
- ✅ Transforms response correctly
- ✅ Handles network errors
- ✅ Provides loading state
- ✅ Navigates on success

---

#### Task 4: Create OnePagerCanvasPage
**File**: `frontend/src/pages/OnePagerCanvasPage.tsx`

**Features**:
- Fetch one-pager by ID from URL params
- Load into onePagerStore
- Render SmartCanvas with toolbar
- Add action buttons (Save, Export, Back)
- Handle loading and error states

**Route**: `/onepager/:id`

**Component Structure**:
```typescript
export function OnePagerCanvasPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useOnePager(id);
  
  useEffect(() => {
    if (data) {
      const frontendOnePager = backendToFrontend(data);
      onePagerStore.setOnePager(frontendOnePager);
    }
  }, [data]);

  return (
    <Box>
      <PageHeader />
      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert />}
      {data && (
        <>
          <SmartCanvas />
          <ActionButtons />
        </>
      )}
    </Box>
  );
}
```

**Acceptance Criteria**:
- ✅ Fetches one-pager from API by ID
- ✅ Transforms and loads into store
- ✅ Renders Smart Canvas
- ✅ Shows loading spinner during fetch
- ✅ Displays error if not found
- ✅ Protected route (requires auth)

---

### Phase 2.3B: Dashboard Integration (1-2 hours)

#### Task 5: Add One-Pager List to Dashboard
**File**: `frontend/src/pages/DashboardPage.tsx`

**Features**:
- Fetch user's one-pagers
- Display as grid of cards
- Show empty state if none
- "Create New" button
- Click card to open in canvas

**UI Layout**:
```
┌─────────────────────────────────────────┐
│ Dashboard Header                         │
├─────────────────────────────────────────┤
│ Welcome, User! 👋                       │
│ [Account Details]                        │
├─────────────────────────────────────────┤
│ Your One-Pagers     [+ Create New]     │
│                                          │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │ One-P 1 │ │ One-P 2 │ │ One-P 3 │   │
│ │ Draft   │ │ Final   │ │ Draft   │   │
│ │ 2 days  │ │ 1 week  │ │ Today   │   │
│ └─────────┘ └─────────┘ └─────────┘   │
│                                          │
│ [Brand Kit Section]                     │
└─────────────────────────────────────────┘
```

**OnePagerCard Component**:
- Title
- Status badge (Draft/Wireframe/Styled/Final)
- Last updated timestamp
- Thumbnail preview (future)
- Click to open

**Acceptance Criteria**:
- ✅ Fetches one-pagers from API
- ✅ Displays grid of cards
- ✅ Shows empty state with CTA
- ✅ Create button navigates to form
- ✅ Card click navigates to canvas
- ✅ Loading skeletons during fetch

---

#### Task 6: Create API Service Functions
**File**: `frontend/src/services/onePagerService.ts`

**API Functions**:
```typescript
export const onePagerService = {
  // Create new one-pager
  create: async (data: OnePagerCreateRequest) => {
    const response = await api.post('/onepagers', data);
    return response.data;
  },

  // List user's one-pagers
  list: async () => {
    const response = await api.get('/onepagers');
    return response.data;
  },

  // Get specific one-pager
  get: async (id: string) => {
    const response = await api.get(`/onepagers/${id}`);
    return response.data;
  },

  // Update one-pager
  update: async (id: string, data: Partial<BackendOnePager>) => {
    const response = await api.put(`/onepagers/${id}`, data);
    return response.data;
  },

  // Delete one-pager
  delete: async (id: string) => {
    await api.delete(`/onepagers/${id}`);
  }
};
```

**TanStack Query Hooks**:
```typescript
export function useOnePagers() {
  return useQuery({
    queryKey: ['onepagers'],
    queryFn: onePagerService.list
  });
}

export function useOnePager(id: string) {
  return useQuery({
    queryKey: ['onepagers', id],
    queryFn: () => onePagerService.get(id)
  });
}

export function useUpdateOnePager() {
  return useMutation({
    mutationFn: ({ id, data }) => onePagerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['onepagers']);
    }
  });
}
```

**Acceptance Criteria**:
- ✅ All API functions implemented
- ✅ TanStack Query hooks created
- ✅ Cache invalidation on mutations
- ✅ Error handling
- ✅ TypeScript types

---

### Phase 2.3C: Save & Persistence (1 hour)

#### Task 7: Implement Save Functionality
**File**: `frontend/src/components/canvas/CanvasActions.tsx`

**Features**:
- Save button in toolbar
- Auto-save on changes (debounced)
- Visual feedback (saving indicator)
- Error handling
- Last saved timestamp

**Save Logic**:
```typescript
const { mutate: saveOnePager, isPending } = useUpdateOnePager();

const handleSave = () => {
  const currentState = onePagerStore.currentOnePager;
  if (!currentState) return;

  // Transform frontend → backend format
  const backendFormat = frontendToBackend(currentState);

  // Save to API
  saveOnePager({
    id: currentState.id,
    data: backendFormat
  });
};

// Auto-save every 30 seconds if changes exist
useEffect(() => {
  const interval = setInterval(() => {
    if (hasUnsavedChanges()) {
      handleSave();
    }
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

**UI Indicators**:
- "Saved" - Green checkmark
- "Saving..." - Spinner
- "Unsaved changes" - Orange dot
- "Save failed" - Red X with retry

**Acceptance Criteria**:
- ✅ Manual save button works
- ✅ Auto-save every 30 seconds
- ✅ Visual feedback on save status
- ✅ Error handling with retry
- ✅ Debounced to prevent rapid saves

---

## 🎨 UI/UX Design

### Creation Form Layout

```
┌──────────────────────────────────────────────────────────┐
│  Create New One-Pager                                     │
│  [Back to Dashboard]                                      │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  One-Pager Title *                                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Product Launch: Q1 2025                            │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  What is your product or service? *                      │
│  ┌────────────────────────────────────────────────────┐  │
│  │ AI-powered marketing tool that helps teams...     │  │
│  │                                                     │  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
│  10-2000 characters. Describe features, benefits.        │
│                                                            │
│  What problem does it solve?                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Marketing teams waste 40% of time on collateral...│  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  Target Audience                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ B2B marketers, sales teams, SMBs                  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  Brand Kit (optional)                                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ▼ Select brand kit...                             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  [ Cancel ]              [ Generate with AI → ]          │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

### Loading State

```
┌──────────────────────────────────────────────────────────┐
│                     Creating Your One-Pager               │
├──────────────────────────────────────────────────────────┤
│                                                            │
│                     🤖 AI is working...                   │
│                                                            │
│                    [████████████░░░░░░] 75%              │
│                                                            │
│              Analyzing your product description           │
│              Structuring wireframe layout                 │
│              ✓ Generating headline and content            │
│                                                            │
│                   This may take 10-30 seconds             │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

### Canvas Page with Actions

```
┌──────────────────────────────────────────────────────────┐
│  Product Launch Q1 2025      [Saving...] [Export] [Back]│
│  Wireframe ⟷ Styled    - [100%] +                       │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  [Smart Canvas Content Here]                              │
│                                                            │
│  [All Elements Rendered]                                  │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Strategy

### Unit Tests
- Form validation logic
- Data transformation functions
- API service functions
- Store actions

### Integration Tests
- Form submission → API call
- API response → Store update
- Store update → Canvas render
- Save functionality → API update

### E2E Tests (Playwright)
```typescript
test('Complete one-pager creation workflow', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to create
  await page.click('text=Create New One-Pager');

  // Fill form
  await page.fill('[name="title"]', 'Test One-Pager');
  await page.fill('[name="product"]', 'AI marketing tool that helps teams create collateral faster');
  await page.fill('[name="problem"]', 'Marketing teams waste 40% of time on manual design work');
  await page.fill('[name="audience"]', 'B2B marketers');

  // Submit
  await page.click('text=Generate with AI');

  // Wait for generation
  await page.waitForURL('/onepager/*');

  // Verify canvas loaded
  await expect(page.locator('text=Test One-Pager')).toBeVisible();
  await expect(page.locator('[data-testid="smart-canvas"]')).toBeVisible();
});
```

---

## 📦 File Structure

```
frontend/src/
├── pages/
│   ├── OnePagerCreatePage.tsx        (new)
│   ├── OnePagerCanvasPage.tsx        (new)
│   └── DashboardPage.tsx             (update)
│
├── components/
│   ├── onepager/
│   │   ├── CreateOnePagerForm.tsx    (new)
│   │   ├── OnePagerCard.tsx          (new)
│   │   ├── OnePagerList.tsx          (new)
│   │   └── EmptyOnePagerState.tsx    (new)
│   │
│   └── canvas/
│       ├── CanvasActions.tsx          (new)
│       └── SaveIndicator.tsx          (new)
│
├── services/
│   └── onePagerService.ts             (new)
│
├── hooks/
│   ├── useOnePagerCreation.ts         (new)
│   ├── useOnePagers.ts                (new)
│   └── useOnePager.ts                 (new)
│
└── types/
    └── api.types.ts                   (update)
```

---

## 🔗 API Integration Reference

### Backend Endpoints

**Create One-Pager**:
```
POST /api/v1/onepagers
Content-Type: application/json
Authorization: Bearer <token>

Request Body:
{
  "title": "Product Launch Q1 2025",
  "input_prompt": "AI-powered marketing tool...",
  "target_audience": "B2B marketers",
  "brand_kit_id": "67890..." (optional)
}

Response (201):
{
  "_id": "67890abcdef...",
  "user_id": "12345...",
  "brand_kit_id": "67890..." (optional),
  "title": "Product Launch Q1 2025",
  "status": "wireframe",
  "content": {
    "headline": "Transform Your Marketing...",
    "subheadline": "Create stunning...",
    "sections": [...]
  },
  "layout": [...],
  "created_at": "2025-10-08T12:00:00Z",
  "updated_at": "2025-10-08T12:00:00Z"
}
```

**List One-Pagers**:
```
GET /api/v1/onepagers
Authorization: Bearer <token>

Response (200):
[
  {
    "_id": "...",
    "title": "...",
    "status": "draft",
    "created_at": "...",
    "updated_at": "..."
  }
]
```

**Get One-Pager**:
```
GET /api/v1/onepagers/{id}
Authorization: Bearer <token>

Response (200):
{
  "_id": "...",
  "user_id": "...",
  "title": "...",
  "content": {...},
  "layout": [...]
}
```

**Update One-Pager**:
```
PUT /api/v1/onepagers/{id}
Authorization: Bearer <token>

Request Body: (partial update)
{
  "content": {...},
  "layout": [...],
  "status": "styled"
}

Response (200):
{
  "_id": "...",
  "updated_at": "..."
}
```

---

## 🎯 Success Metrics

### Phase 2.3 Complete When:

- ✅ User can create one-pager from dashboard
- ✅ Form validates input correctly
- ✅ AI generation works end-to-end
- ✅ Generated one-pager loads in Smart Canvas
- ✅ User can view all their one-pagers
- ✅ Save functionality persists changes
- ✅ No blocking errors in console
- ✅ All TypeScript compiles
- ✅ Basic E2E test passes

### User Can Successfully:

1. ✅ Click "Create New One-Pager" from dashboard
2. ✅ Fill out creation form with product details
3. ✅ Select optional brand kit
4. ✅ Submit form and wait for AI generation
5. ✅ See loading indicator during generation
6. ✅ View generated one-pager in Smart Canvas
7. ✅ Toggle between wireframe and styled modes
8. ✅ Save changes manually or automatically
9. ✅ Navigate back to dashboard
10. ✅ See their one-pager in the list

---

## 📅 Implementation Timeline

### Session 1: Creation Form (2-3 hours)
- Task 1: OnePagerCreatePage
- Task 2: CreateOnePagerForm
- Task 3: API integration hook
- Test form submission

### Session 2: Canvas Integration (1-2 hours)
- Task 4: OnePagerCanvasPage
- Task 6: API service functions
- Test loading one-pager

### Session 3: Dashboard & Save (1-2 hours)
- Task 5: Dashboard integration
- Task 7: Save functionality
- End-to-end testing

**Total Estimated Time**: 4-7 hours over 2-3 sessions

---

## 🚀 Getting Started

### Prerequisites Checklist

- ✅ Backend API running (`uvicorn main:app --reload`)
- ✅ Frontend dev server running (`npm run dev`)
- ✅ MongoDB connected
- ✅ Auth system working
- ✅ Smart Canvas components complete
- ✅ User logged in for testing

### First Steps

1. **Create branch**: `git checkout -b feature/onepager-creation-workflow`
2. **Start with Task 1**: OnePagerCreatePage.tsx
3. **Test incrementally**: After each component
4. **Commit frequently**: Small, focused commits

---

## 💡 Implementation Notes

### Form State Management

Use React Hook Form for form handling:
```bash
npm install react-hook-form zod @hookform/resolvers
```

Benefits:
- Built-in validation
- Performance optimization
- TypeScript support
- Easy error handling

### API Error Handling

Implement robust error handling:
```typescript
try {
  const onepager = await createOnePager(data);
  toast.success('One-pager created successfully!');
  navigate(`/onepager/${onepager._id}`);
} catch (error) {
  if (error.response?.status === 400) {
    toast.error('Invalid input. Please check your form.');
  } else if (error.response?.status === 500) {
    toast.error('AI generation failed. Please try again.');
  } else {
    toast.error('Something went wrong. Please try again.');
  }
}
```

### Loading States

Provide clear feedback during AI generation:
- Progress indicator
- Status messages
- Estimated time remaining
- Ability to cancel (future)

---

## 🎓 Learning Objectives

By completing this phase, you'll have implemented:

1. **Complete CRUD workflow** - Create, Read, Update, Delete
2. **API integration patterns** - TanStack Query best practices
3. **Form handling** - Validation, submission, error handling
4. **State synchronization** - Backend ↔ Frontend ↔ Store
5. **User experience flow** - Multi-page workflow
6. **Auto-save patterns** - Debouncing, background persistence
7. **Error boundaries** - Graceful failure handling

---

**Ready to implement?** Let's start with Task 1: OnePagerCreatePage! 🚀
