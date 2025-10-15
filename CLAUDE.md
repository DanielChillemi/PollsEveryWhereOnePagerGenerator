# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-Powered Marketing One-Pager Co-Creation Tool for Poll Everywhere AI Native Demo Day. This MarTech application enables iterative, human-in-the-loop creation of marketing materials through progressive refinement from low-fidelity drafts to polished outputs.

**Core Principle:** Never implement "one-shot" AI generation. Always support iterative refinement with human feedback at each step.

## Architecture

### Monorepo Structure
```
PollsEveryWhereOnePagerGenerator/
├── backend/                    # FastAPI Python backend
│   ├── auth/                  # JWT authentication with bcrypt
│   ├── brand_kits/            # Brand asset management (soft delete with is_active)
│   ├── onepagers/             # One-pager CRUD + AI iteration
│   ├── services/              # AI service, PDF generation
│   ├── database/              # MongoDB connection manager
│   ├── models/                # Pydantic models and helpers
│   └── templates/pdf/         # Jinja2 templates for PDF generation
├── frontend/                   # React 19 + TypeScript
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── hooks/             # TanStack Query hooks for API calls
│   │   ├── services/          # API client services
│   │   ├── stores/            # Zustand state management
│   │   └── types/             # TypeScript definitions
└── DevDocuments/               # Planning docs, gap analysis
```

### Backend (FastAPI + MongoDB + OpenAI)

**Tech Stack:** Python 3.13+, FastAPI, Motor (async MongoDB), OpenAI GPT-4, Playwright (PDF export)

**Critical Design Patterns:**

1. **Content Section Polymorphism**: `ContentSection.content` can be `str | List[str] | Dict[str, Any]`
   - **Hero sections**: `{headline: str, subheadline?: str, description?: str}` OR plain `str`
   - **Button sections**: `{text: str, url: str}` OR plain `str`
   - **List sections**: `List[str]`
   - **Text sections**: `str`

   **IMPORTANT**: When hero type has string content, PDF export converts it (`routes.py:1001-1008`):
   ```python
   if section_type == "hero" and isinstance(section_content, str):
       section_content = {
           "headline": onepager_doc["content"].get("headline", ""),
           "subheadline": onepager_doc["content"].get("subheadline", ""),
           "description": section_content  # String becomes description
       }
   ```

2. **Auto-Generation from Structured Data**: When `input_prompt` is missing, backend auto-builds sections from form fields (`routes.py:128-215`):
   ```python
   if onepager_data.problem:
       sections.append(ContentSection(type="hero", title="The Challenge", content=problem))
   if onepager_data.solution:
       sections.append(ContentSection(type="text", title="Our Solution", content=solution))
   if onepager_data.features:
       sections.append(ContentSection(type="list", title="Key Features", content=features))
   # ... benefits, integrations, social_proof, cta button
   ```

3. **AI Iteration with Context Preservation** (`routes.py:562-694`):
   - Fetches brand_kit for brand context
   - Calls `ai_service.refine_layout()` with current content + user feedback
   - AI returns nested structure: `{content: {headline, subheadline, sections}}`
   - Backend parses nested structure first (`routes.py:645-653`), then falls back to flat structure (`routes.py:655-657`)
   - Updates database FIRST, then creates version snapshot with updated content (`routes.py:667-693`)

4. **Version History System** (`routes.py:697-796`):
   - Version snapshots created after AI iterations
   - Each snapshot contains: version number, content, layout, timestamp, change description
   - `POST /{onepager_id}/restore/{version}` endpoint reverts to previous version
   - Restore action creates new snapshot documenting the restore
   - Frontend displays timeline with version comparison

5. **Direct Content Updates** (`routes.py:466-551`):
   - `PATCH /{onepager_id}/content` endpoint for non-AI updates
   - Used for drag-and-drop reordering, inline editing, section deletion
   - Does NOT trigger AI processing or create version snapshots
   - Enables immediate user edits without AI latency

6. **PDF Generation Pipeline** (`routes.py:856-1079`):
   - Fetch OnePager + Brand Kit from MongoDB
   - Convert to `OnePagerLayout` format (elements array with hero, text, list, button types)
   - Handle hero content type conversion (string → dict) at export time
   - Generate HTML via Jinja2 template with selected template style
   - Convert HTML to PDF via Playwright (headless Chromium)
   - Return as StreamingResponse with download headers
   - Supports multiple templates: minimalist, bold, business, product

**Database Collections:**
- `users` - User accounts (email, hashed password, JWT tokens)
- `brand_kits` - Brand assets (colors, fonts, logo, products, soft delete via `is_active`)
- `onepagers` - Marketing one-pagers (content, layout, generation_metadata, version_history)

**MongoDB Database Name:** `marketing_onepager` (NOT `onepager_db`)

### Frontend (React 19 + TypeScript + Chakra UI v3)

**Tech Stack:** React 19, TypeScript, Vite, Chakra UI v3, TanStack Query v5, Zustand, React Router v7, @dnd-kit, date-fns

**State Architecture:**
- **Zustand** (`stores/authStore.ts`): JWT tokens, user state (persisted to localStorage)
- **TanStack Query v5**: Server state with automatic caching/invalidation via hooks
- **Component-local state**: UI state (forms, modals, edit modes)

**Critical Patterns:**

1. **TanStack Query Hooks Pattern** (`hooks/useOnePager.ts`, `hooks/useBrandKit.ts`):
   - All API calls wrapped in custom hooks using TanStack Query
   - Mutations automatically invalidate relevant queries on success
   - Example: `useRestoreOnePagerVersion()` invalidates both detail and list caches
   - Query keys structured hierarchically: `['onepager', id]`, `['onepagers', {skip, limit}]`

2. **Service Layer** (`services/onepagerService.ts`, `services/brandKitService.ts`):
   - Axios-based API clients with centralized error handling
   - Transform MongoDB `_id` to frontend `id` convention
   - All services accept `token: string` parameter from Zustand auth store
   - Consistent pattern: `async function(data, token) => Promise<T>`

3. **Component Architecture**:
   - **SectionRenderer** (`components/onepager/SectionRenderer.tsx`): Handles polymorphic section content types, delegates to type-specific components
   - **DraggableSectionList** (`components/onepager/DraggableSectionList.tsx`): @dnd-kit integration for section reordering with inline edit/delete
   - **VersionHistorySidebar** (`components/onepager/VersionHistorySidebar.tsx`): Timeline view with restore functionality, uses date-fns for relative timestamps
   - **SaveStatusIndicator** (`components/common/SaveStatusIndicator.tsx`): Real-time save status display

4. **Section Components** (`components/onepager/sections/`):
   - **HeroSection**: Accepts `{headline, subheadline?, description?}` object
   - **ButtonSection**: Accepts `{text, url}` and handles `window.open(url, '_blank')`
   - **ListSection**: Renders `string[]` as bullet list
   - **TextSection**: Renders plain string content

5. **Type Safety**:
   - `types/onepager.ts` must match `backend/onepagers/schemas.py` exactly
   - Key types: `OnePagerCreateData`, `OnePagerResponse`, `ContentSection`, `OnePagerSummary`
   - Pydantic models on backend ensure runtime validation

## Development Commands

### Backend
```bash
# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# Start dev server with auto-reload (port 8000)
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# View interactive API docs (Swagger UI)
open http://localhost:8000/docs

# Health check with database status
curl http://localhost:8000/health

# Run authentication test script
python test_auth_flow.py

# Install dependencies
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend

# Start Vite dev server with HMR (port 5173)
npm run dev

# Type checking without emit
npx tsc --noEmit

# Build for production
npm run build

# Lint with ESLint
npm run lint

# Install dependencies
npm install
```

### Environment Variables

**Backend `.env` (required):**
```bash
MONGODB_URL=mongodb://localhost:27017        # Or MongoDB Atlas
JWT_SECRET_KEY=<random-secret>
JWT_REFRESH_SECRET_KEY=<random-secret>
OPENAI_API_KEY=<openai-api-key>              # Required for AI
FRONTEND_URL=http://localhost:5173           # CORS origin
```

**Frontend `.env` (optional):**
```bash
VITE_API_BASE_URL=http://localhost:8000
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - Login (returns JWT access + refresh tokens)
- `POST /api/v1/auth/refresh` - Refresh access token using refresh token
- `GET /api/v1/auth/me` - Get current user profile

### Brand Kits
- `POST /api/v1/brand-kits` - Create brand kit
- `GET /api/v1/brand-kits` - List user's brand kits (excludes soft-deleted)
- `GET /api/v1/brand-kits/{id}` - Get specific brand kit
- `PUT /api/v1/brand-kits/{id}` - Update brand kit
- `DELETE /api/v1/brand-kits/{id}` - Soft delete (sets `is_active=False`)

### OnePagers
- `POST /api/v1/onepagers` - Create OnePager (with optional AI generation)
- `GET /api/v1/onepagers` - List user's OnePagers (paginated, filterable)
- `GET /api/v1/onepagers/{id}` - Get specific OnePager
- `PATCH /api/v1/onepagers/{id}` - Update metadata (e.g., link brand_kit_id)
- `PATCH /api/v1/onepagers/{id}/content` - Direct content update (no AI)
- `PUT /api/v1/onepagers/{id}/iterate` - AI iteration with user feedback
- `POST /api/v1/onepagers/{id}/restore/{version}` - Restore to previous version
- `DELETE /api/v1/onepagers/{id}` - Delete OnePager (hard delete)
- `GET /api/v1/onepagers/{id}/export/pdf?format=letter|a4|tabloid&template=minimalist|bold|business|product` - Export to PDF

### System
- `GET /` - API information
- `GET /health` - Health check with database connection status
- `GET /docs` - Interactive API docs (Swagger UI)
- `GET /redoc` - Alternative API docs (ReDoc)

## Schema Alignment (Backend ↔ Frontend)

**OnePager Creation Payload:**
```typescript
// Frontend must send
{
  title: string,                    // Required
  problem: string,                  // Required, 10-2000 chars
  solution: string,                 // Required, 10-2000 chars
  features?: string[],              // Optional list
  benefits?: string[],              // Optional list
  integrations?: string[],          // Optional list
  social_proof?: string,            // Optional
  cta: {text: string, url: string}, // Required object
  visuals?: Array<{type: string, url: string, description?: string}>,
  brand_kit_id?: string,            // Optional ObjectId
  product_id?: string,              // Optional product from brand kit
  target_audience?: string,         // Optional
  input_prompt?: string             // Optional AI prompt
}
```

**Backend Section Generation Logic:**
- If `input_prompt` provided → AI generates sections via OpenAI
- Else → Auto-build sections from structured fields (problem, solution, features, benefits, cta)
- Both paths populate `ContentSection[]` array

**Frontend Section Rendering:**
- Check `typeof section.content` before rendering
- Extract fields from object types (button needs `{text, url}`, hero needs `{headline, ...}`)
- Use type guards to handle polymorphic content safely

## Common Patterns & Solutions

### Version History Integration
```typescript
// Hook usage
const restoreVersionMutation = useRestoreOnePagerVersion();

// Restore handler
const handleRestoreVersion = async (version: number) => {
  await restoreVersionMutation.mutateAsync({ id, version });
  // TanStack Query automatically refetches and updates UI
};

// Component
<VersionHistorySidebar
  versions={onepager.version_history || []}
  currentVersion={onepager.version_history?.length || 0}
  onRestore={handleRestoreVersion}
  isRestoring={restoreVersionMutation.isPending}
/>
```

### Direct Content Updates (No AI)
```typescript
// Hook usage
const contentUpdateMutation = useUpdateOnePagerContent();

// Section reorder (drag-and-drop)
const handleSectionReorder = (newSections: any[]) => {
  contentUpdateMutation.mutate({
    id: id!,
    data: { sections: newSections }
  });
};

// Inline edit
const handleSectionEdit = (sectionId: string, newContent: any) => {
  const updatedSections = sections.map(s =>
    s.id === sectionId ? { ...s, content: newContent } : s
  );
  contentUpdateMutation.mutate({
    id: id!,
    data: { sections: updatedSections }
  });
};
```

### Problem: "Objects are not valid as React child"
**Cause:** Rendering object content directly without extracting fields

**Solution:**
```typescript
// Wrong
<Button>{section.content}</Button>

// Right
const buttonContent = typeof section.content === 'string'
  ? section.content
  : (section.content as any)?.text || 'Button';
<Button>{buttonContent}</Button>
```

### Problem: Empty sections array after creation
**Cause:** Missing `input_prompt` and backend didn't auto-generate from structured data

**Solution:** Ensure `routes.py:128-215` logic builds sections from problem/solution/features/benefits/cta

### Problem: AI iteration not updating content
**Root Cause:** Backend parsing AI response incorrectly

**Solution:** Check nested structure first (`routes.py:645-653`), then flat structure (`routes.py:655-657`)

### Problem: Version history saving old content
**Root Cause:** Snapshot created before database update

**Solution:** Update DB first, fetch updated doc, then create snapshot (`routes.py:667-693`)

## PDF Generation Architecture

### Template System
Located in `backend/templates/pdf/`:
- `onepager_base.html` - Main template (single-page layout, 2-column grid)
- `sections/hero.html` - Hero section template
- `sections/text.html` - Text section template
- `sections/list.html` - List section template
- `sections/button.html` - Button/CTA section template

**Template Styles:**
- **minimalist**: Clean 2-column layout with subtle gradients
- **bold**: Diagonal/asymmetric design with strong visual hierarchy
- **business**: Data-focused grid with charts and metrics
- **product**: Visual showcase with large images and feature highlights

**Design Features:**
- **Single page fit**: All content constrained to page size via `overflow: hidden`
- **2-column grid layout**: Left column (lists/features), Right column (text/offers)
- **Hero section**: Gradient background at top with headline + description
- **CTA footer**: Gradient footer with prominent button
- **Visual elements**: Icons, checkmarks for lists, highlight boxes
- **Brand Kit integration**: CSS variables for colors/fonts auto-applied

### PDF Export Flow
1. User clicks "Export PDF" → Frontend calls `GET /api/v1/onepagers/{id}/export/pdf?format=letter&template=minimalist`
2. Backend fetches OnePager + Brand Kit from MongoDB
3. Converts to `OnePagerLayout` format with elements array
4. Handles hero content type conversion (string → dict) at `routes.py:1001-1008`
5. Renders Jinja2 template with OnePager data + Brand Kit styles
6. Playwright launches headless Chromium, loads HTML, generates PDF
7. Returns PDF as `StreamingResponse` with download filename

**Performance:**
- Google Fonts loaded via `<link>` tags
- Playwright waits 1 second for font loading before PDF render
- Typical generation time: 2-5 seconds

## AI Service Integration

**OpenAI GPT-4 Integration** (`backend/services/ai_service.py`):
- `generate_initial_wireframe()`: Generate OnePager content from user prompt + brand context
- `refine_layout()`: Iteratively refine based on user feedback
- Model: `gpt-4` (configurable via `settings.ai_model_name`)
- Temperature: 0.7 for balanced creativity

**AI Prompt Design Principles:**
1. **System prompt** enforces JSON-only output, no extra text
2. **Section flexibility**: AI can add/remove sections based on feedback (no hard limit)
3. **Brand context**: Pass color_palette, typography, brand_voice to AI
4. **Explicit instructions**: "Add a new section" → AI adds to array, "Remove" → AI deletes, "Modify" → AI updates existing

**AI Response Structure:**
```json
{
  "content": {
    "headline": "Main headline",
    "subheadline": "Optional subheadline",
    "sections": [
      {"id": "section-1", "type": "hero", "title": "...", "content": "...", "order": 1},
      {"id": "section-2", "type": "list", "title": "...", "content": ["item1", "item2"], "order": 2}
    ]
  }
}
```

## Current Implementation Status

**Backend:** ✅ 100% Complete
- Authentication with JWT
- Brand Kits with soft delete
- OnePagers CRUD
- AI iteration with version history
- Direct content updates
- Version restore
- PDF export with multiple templates

**Frontend:** ✅ ~95% Complete
- Authentication flow
- Brand Kit management
- OnePager creation with structured forms
- OnePager list/detail pages
- AI iteration interface
- Canvas interactive editing (drag-and-drop, inline edit, delete)
- Auto-save system with status indicator
- Version history sidebar with restore
- PDF export with template selection
- Wireframe/Styled mode toggle

**Recent Completions:**
- Version History UI with timeline and restore functionality
- Direct content updates for drag-and-drop and inline editing
- Auto-save indicator with last saved timestamp
- PDF template selection (4 templates)
- Enhanced product selection with visual feedback
- Wireframe mode polish with paper texture and hand-drawn aesthetic

## Known Implementation Details

### Version History
- Snapshots created automatically after AI iterations
- Each snapshot includes: version number, content, layout, timestamp, change description
- Frontend displays timeline sorted newest-first
- Restore creates new snapshot documenting the restore action
- Uses date-fns for relative timestamps ("2 hours ago")

### Auto-Save System
- Uses TanStack Query mutation state for save status
- Displays "Saving...", "Saved", or "Error" indicator
- Shows last saved timestamp
- Prevents browser close during save with beforeunload handler
- No debouncing needed - TanStack Query handles request deduplication

### Canvas Editing
- @dnd-kit for drag-and-drop section reordering
- Inline editing with contentEditable or modal forms
- Section delete with confirmation
- All edits use `PATCH /content` endpoint (no AI processing)
- Immediate UI updates via optimistic mutations

### PDF Export
- Four template options: minimalist, bold, business, product
- Three page formats: letter, a4, tabloid
- Brand Kit styling applied automatically via CSS variables
- Playwright-based generation (requires headless Chromium)
- Streaming response with download headers
- Hero content type conversion handled at export time

### Product Selection (Enhanced Creation Form)
- Brand Kits can include products with pre-defined content (`brandKitService.ts:5-12`)
- Product dropdown appears when brand kit with products is selected
- Auto-populates fields when product selected: `problem`, `solution`, `features`, `benefits`
- Visual feedback: green background tint, success message box, clear selection button
- Backend validates `product_id` against brand kit products (`routes.py:107-116`)
- Product ID stored in `generation_metadata.product_id` for tracking

**Product Interface:**
```typescript
interface Product {
  id: string;
  name: string;
  default_problem?: string;
  default_solution?: string;
  features?: string[];
  benefits?: string[];
}
```

**Auto-fill Logic** (`OnePagerCreatePage.tsx:59-75`):
```typescript
const handleProductSelect = (productId: string) => {
  const product = selectedBrandKit?.products?.find(p => p.id === productId);
  if (product) {
    setFormData({
      ...formData,
      product_id: productId,
      problem: product.default_problem || formData.problem,
      solution: product.default_solution || formData.solution,
      features: product.features?.length > 0 ? product.features : formData.features,
      benefits: product.benefits?.length > 0 ? product.benefits : formData.benefits,
    });
  }
};
```

### Wireframe Mode (Low-Fidelity View)
- Toggle between styled (brand colors) and wireframe (grayscale structure) modes
- Wireframe mode emphasizes content hierarchy and layout over branding
- Implemented via CSS class toggle on container element (`wireframe-mode.css`)
- Smooth 0.4s transition between modes for polished UX

**Visual Features:**
- **Paper texture background**: Subtle repeating-linear-gradient for sketch-like feel
- **Hand-drawn aesthetic**: 2px dashed borders (#999999) on sections
- **Sketch-like shadows**: Flat 2px 2px 0px shadows instead of soft shadows
- **Monospace labels**: Section type labels with Courier New font
- **Grayscale filter**: grayscale(100%) + sepia(5%) for paper-like appearance
- **Button hover effects**: translate(-1px, -1px) with enhanced shadow
- **Hero section overlay**: "🖼️ HERO" label positioned absolutely

**Implementation** (`wireframe-mode.css`):
```css
/* Main wireframe container */
.wireframe-mode {
  filter: grayscale(100%) sepia(5%);
  transition: filter 0.4s ease-in-out;
  position: relative;
}

/* Paper texture background */
.wireframe-mode::before {
  content: '';
  position: absolute;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.01) 0px,
    transparent 1px,
    transparent 2px,
    rgba(0, 0, 0, 0.01) 3px
  );
  pointer-events: none;
  opacity: 0.3;
}

/* Section styling */
.wireframe-mode .section-container {
  background: #fafafa !important;
  border: 2px dashed #999999 !important;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1) !important;
}

/* Section type labels */
.wireframe-mode .section-type-label {
  display: block !important;
  font-family: 'Courier New', monospace;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

**Toggle Integration** (`OnePagerDetailPage.tsx`):
- State managed via `useState<'wireframe' | 'styled'>('styled')`
- Toggle button in header controls mode switching
- CSS class applied conditionally to canvas container
- Mode badge shows current state (wireframe badge vs styled badge)

## Deployment Notes

**Target Platform:** Vercel (frontend + backend)
- Frontend: Static hosting (Vite build)
- Backend: Serverless Functions (requires FastAPI adapter)
- Database: MongoDB Atlas
- AI: OpenAI API

**Playwright Compatibility:** Requires special serverless configuration for PDF generation. Consider cloud PDF service for production (e.g., DocRaptor, PDFShift) if Playwright setup is complex.

## Additional Resources

- API Docs: http://localhost:8000/docs (when running)
- README: Setup instructions and project overview
