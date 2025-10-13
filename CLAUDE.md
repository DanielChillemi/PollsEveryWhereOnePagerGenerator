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
│   │   ├── hooks/             # React hooks for API calls
│   │   ├── services/          # API client, auth logic
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

   **IMPORTANT**: When hero type has string content, PDF export converts it (`routes.py:805-812`):
   ```python
   if section_type == "hero" and isinstance(section_content, str):
       section_content = {
           "headline": onepager_doc["content"].get("headline", ""),
           "subheadline": onepager_doc["content"].get("subheadline", ""),
           "description": section_content  # String becomes description
       }
   ```

2. **Auto-Generation from Structured Data**: When `input_prompt` is missing, backend auto-builds sections from form fields (`routes.py:126-214`):
   ```python
   if onepager_data.problem:
       sections.append(ContentSection(type="hero", title="The Challenge", content=problem))
   if onepager_data.solution:
       sections.append(ContentSection(type="text", title="Our Solution", content=solution))
   if onepager_data.features:
       sections.append(ContentSection(type="list", title="Key Features", content=features))
   # ... benefits, integrations, social_proof, cta button
   ```

3. **AI Iteration with Context Preservation** (`routes.py:473-605`):
   - Fetches brand_kit for brand context
   - Calls `ai_service.refine_layout()` with current content + user feedback
   - AI returns nested structure: `{content: {headline, subheadline, sections}}`
   - Backend parses nested structure first, then falls back to flat structure
   - Creates version snapshot **after** update (not before) to save correct content

4. **PDF Generation Pipeline** (`routes.py:678-882`):
   - Fetch OnePager + Brand Kit from MongoDB
   - Convert to `OnePagerLayout` format (elements array with hero, text, list, button types)
   - Generate HTML via Jinja2 template (`templates/pdf/onepager_base.html`)
   - Convert HTML to PDF via Playwright (headless Chromium)
   - Return as StreamingResponse with download headers

**Database Collections:**
- `users` - User accounts (email, hashed password, JWT tokens)
- `brand_kits` - Brand assets (colors, fonts, logo, products, soft delete via `is_active`)
- `onepagers` - Marketing one-pagers (content, layout, generation_metadata, version_history)

**MongoDB Database Name:** `marketing_onepager` (NOT `onepager_db`)

### Frontend (React 19 + TypeScript + Chakra UI v3)

**Tech Stack:** React 19, TypeScript, Vite, Chakra UI v3, TanStack Query v5, Zustand, React Router v7, @dnd-kit

**State Architecture:**
- **Zustand** (`stores/authStore.ts`): JWT tokens, user state (persisted to localStorage)
- **TanStack Query**: Server state with automatic caching/invalidation
- **Component-local state**: UI state (forms, modals, edit modes)

**Critical Components:**

1. **SectionRenderer** (`components/onepager/SectionRenderer.tsx`):
   - Handles polymorphic section content types
   - Must check `typeof section.content` before rendering
   - Delegates to type-specific components (HeroSection, TextSection, ListSection, ButtonSection)

2. **Section Components** (`components/onepager/sections/`):
   - **HeroSection**: Accepts `{headline, subheadline?, description?}` object
   - **ButtonSection**: Accepts `{text, url}` and handles `window.open(url, '_blank')`
   - **ListSection**: Renders `string[]` as bullet list
   - **TextSection**: Renders plain string content

3. **Type Safety**:
   - `types/onepager.ts` must match `backend/onepagers/schemas.py` exactly
   - Key types: `OnePagerCreateData`, `OnePagerResponse`, `ContentSection`

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

# Lint with ESLint
npm run lint

# Production build
npm run build

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
- `PUT /api/v1/onepagers/{id}/iterate` - AI iteration with user feedback
- `DELETE /api/v1/onepagers/{id}` - Delete OnePager (hard delete)
- `GET /api/v1/onepagers/{id}/export/pdf?format=letter|a4|tabloid` - Export to PDF

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
  cta: {text: string, url: string}, // Required object
  brand_kit_id?: string,            // Optional ObjectId
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

## Common Type Mismatches & Solutions

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
```

### Problem: Empty sections array after creation
**Cause:** Missing `input_prompt` and backend didn't auto-generate from structured data

**Solution:** Ensure `routes.py:126-214` logic builds sections from problem/solution/features/benefits/cta

### Problem: PDF shows empty hero headline
**Cause:** Hero section content is string but template expects `{headline, subheadline, description}` dict

**Solution:** Backend converts at PDF export time (`routes.py:805-812`)

## PDF Generation Architecture

### Template System
Located in `backend/templates/pdf/`:
- `onepager_base.html` - Main template (single-page layout, 2-column grid)
- `sections/hero.html` - Hero section template
- `sections/text.html` - Text section template
- `sections/list.html` - List section template
- `sections/button.html` - Button/CTA section template

**New Template Design (as of recent update):**
- **Single page fit**: All content constrained to 8.5×11" (Letter) via `overflow: hidden`
- **2-column grid layout**: Left column (lists/features), Right column (text/offers)
- **Hero section**: Gradient background at top with headline + description
- **CTA footer**: Gradient footer with prominent button
- **Visual elements**: Icons (⚡ Features, 🎯 Benefits), checkmarks for lists, highlight boxes for special offers
- **Brand Kit integration**: CSS variables for colors/fonts auto-applied

### PDF Export Flow
1. User clicks "Export PDF" → Frontend calls `GET /api/v1/onepagers/{id}/export/pdf?format=letter`
2. Backend fetches OnePager + Brand Kit from MongoDB
3. Converts to `OnePagerLayout` format with elements array
4. Handles hero content type conversion (string → dict)
5. Renders Jinja2 template with OnePager data + Brand Kit styles
6. Playwright launches headless Chromium, loads HTML, generates PDF
7. Returns PDF as `StreamingResponse` with download filename

**Performance:**
- Google Fonts loaded via `<link>` tags
- Playwright waits 1 second for font loading before PDF render
- Typical generation time: 2-5 seconds

## Testing & Debugging

### Backend Testing
```bash
# Manual API testing
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","full_name":"Test User"}'

# Check MongoDB collections (use mongo shell or Compass)
# Collections: users, brand_kits, onepagers
# Database: marketing_onepager
```

### Frontend Debugging

**Browser Cache Issues:**
- Vite HMR doesn't always clear cache
- Solution: Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`) or use incognito mode

**React DevTools:**
- Check Zustand store: `useAuthStore.getState()` in console
- Inspect TanStack Query cache for stale data
- Monitor Network tab for 401 errors (expired JWT)

**Common Errors:**
1. "Objects are not valid as React child" → Content type mismatch in section rendering
2. 401 Unauthorized → JWT token expired, re-login required
3. Empty sections → Missing `input_prompt` and structured data not provided

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

## Known Issues & Fixes

### Issue: AI iteration not updating content
**Root Cause:** Backend was checking for flat `{sections: []}` but AI returns nested `{content: {sections: []}}`

**Fix:** `routes.py:554-568` now checks nested structure first, then falls back to flat

### Issue: Version history saving old content
**Root Cause:** Snapshot created before database update

**Fix:** `routes.py:578-600` now updates DB first, fetches updated doc, then creates snapshot

### Issue: PDF shows empty hero headline
**Root Cause:** Hero content was string, but template expects dict

**Fix:** `routes.py:805-812` converts string to dict at PDF export time

## Current Status

**Backend:** ✅ 100% Complete
- Authentication, Brand Kits, OnePagers, AI iteration, PDF export

**Frontend:** ⚠️ ~85% Complete

**Known Gaps** (see `DevDocuments/WEEK_2_MVP_GAP_ANALYSIS.md`):
1. Enhanced creation form with product dropdown
2. Wireframe/Styled canvas toggle (partial implementation)
3. Canvas interactive editing (inline edit, drag-and-drop reordering)
4. Auto-save system
5. One-pager version history sidebar
6. Brand voice stronger integration in AI prompts

## Deployment Notes

**Target Platform:** Vercel (frontend + backend)
- Frontend: Static hosting (Vite build)
- Backend: Serverless Functions (requires FastAPI adapter)
- Database: MongoDB Atlas
- AI: OpenAI API

**Playwright Compatibility:** Requires special serverless configuration. Consider cloud PDF service for production (e.g., DocRaptor, PDFShift).

## Additional Resources

- API Docs: http://localhost:8000/docs (when running)
- Gap Analysis: `DevDocuments/WEEK_2_MVP_GAP_ANALYSIS.md`
- README: Setup instructions and tech stack details
