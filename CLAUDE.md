# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-Powered Marketing One-Pager Co-Creation Tool for Poll Everywhere AI Native Demo Day. This MarTech application enables iterative, human-in-the-loop creation of marketing materials through progressive refinement from low-fidelity drafts to polished outputs.

**Core Principle:** Never implement "one-shot" AI generation. Always support iterative refinement with human feedback at each step.

## Architecture

### Monorepo Structure
```
PollsEveryWhereOnePagerGenerator/
├── backend/          # FastAPI Python backend (MongoDB, JWT, OpenAI, Playwright)
├── frontend/         # React 19 + TypeScript + Vite + Chakra UI
└── DevDocuments/     # Planning docs, gap analysis
```

### Backend (FastAPI + MongoDB)

**Tech Stack:** Python 3.13+, FastAPI, Motor (async MongoDB), OpenAI GPT-4, Playwright PDF export

**Module Structure:**
- `auth/` - JWT authentication with bcrypt, dependency injection pattern
- `brand_kits/` - Brand asset management with soft delete (`is_active` flag)
- `onepagers/` - One-pager CRUD with AI iteration endpoints
- `services/ai_service.py` - OpenAI integration with brand context
- `services/pdf_generator_playwright.py` - HTML-to-PDF conversion
- `database/mongodb.py` - Connection manager with async context

**Critical Design Patterns:**

1. **Section Content Polymorphism**: `ContentSection.content` can be `str | List[str] | Dict[str, Any]`
   - Hero: `{headline: str, subheadline?: str, description?: str}` or plain `str`
   - Button: `{text: str, url: str}` or plain `str`
   - List: `List[str]`
   - Text/Heading: `str`

2. **Auto-Generation from Structured Data**: When `input_prompt` is absent, backend builds sections from structured fields:
   ```python
   # backend/onepagers/routes.py:114-211
   if onepager_data.problem:
       sections.append(ContentSection(type="hero", content=problem))
   if onepager_data.solution:
       sections.append(ContentSection(type="text", content=solution))
   # ... features, benefits, cta, etc.
   ```

3. **Brand Context Flow**: Brand kit data → `brand_context` dict → AI prompts with colors/fonts/voice

**Python 3.13 Compatibility:** Windows requires `asyncio.WindowsProactorEventLoopPolicy()` for Playwright - see `main.py:13-15`

### Frontend (React 19 + TypeScript)

**Tech Stack:** React 19, TypeScript, Vite, Chakra UI v3, TanStack Query v5, Zustand, React Router v7, @dnd-kit

**State Architecture:**
- `stores/authStore.ts` - JWT tokens, user state (Zustand, persisted to localStorage)
- TanStack Query - Server state with automatic caching/invalidation
- Component-local state for UI (forms, modals, edit modes)

**Critical Components:**

1. **SectionRenderer** (`components/onepager/SectionRenderer.tsx:28-139`)
   - Handles polymorphic section content types
   - Must check `typeof section.content` before rendering
   - Supports both string and object formats for button/hero sections

2. **Section Components** (`components/onepager/sections/`)
   - Each section type (Hero, Text, List, Button) has dedicated component
   - Button sections accept `{text, url}` and handle clicks with `window.open(url, '_blank')`
   - Hero sections require `{headline, subheadline?, description?}` object

3. **Type Safety**: `types/onepager.ts` must match `backend/onepagers/schemas.py` exactly
   - `OnePagerCreateData` ↔ `OnePagerCreate`
   - `ContentSection` ↔ `ContentSection`

## Development Commands

### Backend
```bash
# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# Start dev server with auto-reload
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# View interactive API docs
open http://localhost:8000/docs

# Run backend tests
python test_auth_flow.py

# Install dependencies
pip install -r requirements.txt

# Database check (MongoDB must be running)
curl http://localhost:8000/health
```

### Frontend
```bash
cd frontend

# Start Vite dev server with HMR
npm run dev
# Opens http://localhost:5173

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

Backend `.env` (required):
```bash
MONGODB_URL=mongodb://localhost:27017        # Or MongoDB Atlas connection string
JWT_SECRET_KEY=<random-secret>
JWT_REFRESH_SECRET_KEY=<random-secret>
OPENAI_API_KEY=<openai-api-key>              # Required for AI generation
FRONTEND_URL=http://localhost:5173           # CORS allowed origin
```

Frontend `.env` (optional):
```bash
VITE_API_BASE_URL=http://localhost:8000      # Backend API URL
```

## Critical Integration Points

### Backend-Frontend Schema Alignment

**OnePager Creation Payload**:
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

**Backend Section Generation Logic** (`backend/onepagers/routes.py:114-211`):
- If `input_prompt` exists → call OpenAI for AI-generated sections
- Else → auto-build sections from structured data (problem, solution, features, benefits, cta)
- Both paths populate `ContentSection[]` array

**Frontend Section Rendering** (`frontend/src/components/onepager/SectionRenderer.tsx`):
- Must handle polymorphic `section.content` types
- Check `typeof section.content` before casting
- Button: Extract `{text, url}` from content object
- Hero: Convert string to `{headline, description}` if needed

### Common Type Mismatches

**Problem:** React error "Objects are not valid as a React child"
**Cause:** Rendering object content directly (e.g., `{text, url}`) without extracting fields
**Solution:**
```typescript
// Wrong
<Button>{section.content}</Button>

// Right
const buttonContent = typeof section.content === 'string'
  ? section.content
  : (section.content as any)?.text || 'Button';
```

## Testing & Debugging

### Backend Testing
```bash
# Manual API testing
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","full_name":"Test User"}'

# Interactive Swagger UI
open http://localhost:8000/docs

# Check MongoDB collections
# Collections: users, brand_kits, onepagers
```

### Frontend Debugging

**Browser Cache Issues:**
- Vite HMR doesn't always clear browser cache
- Solution: Hard refresh (`Cmd+Shift+R` or `Ctrl+Shift+R`)
- Use incognito mode for clean state testing

**React DevTools:**
- Check Zustand store: `useAuthStore.getState()`
- Inspect TanStack Query cache for stale data
- Monitor Network tab for API responses

**Common Errors:**
1. "Objects are not valid as React child" → Content type mismatch in section rendering
2. 401 Unauthorized → JWT token expired, check `useAuthStore` token state
3. Empty sections array → Missing `input_prompt` and structured data

## Known Issues & Solutions

### Issue: OnePager Canvas Shows "No sections yet"
**Root Cause:** Backend didn't generate sections because `input_prompt` was absent and structured data wasn't converted to sections.

**Fix Applied:** `backend/onepagers/routes.py:123-211` now auto-generates sections from structured fields when AI is not invoked.

### Issue: React Error in ButtonSection
**Root Cause:** Backend sends `{text, url}` object but frontend expected string.

**Fix Applied:**
- `SectionRenderer.tsx:68-82` extracts text/url from object
- `ButtonSection.tsx:11-47` accepts `url` prop and implements click handler

## Current Development Status

**Backend:** ✅ 100% Complete
- Authentication, Brand Kits, AI Generation, PDF Export

**Frontend:** ⚠️ 80% Complete (see `DevDocuments/WEEK_2_MVP_GAP_ANALYSIS.md`)

**Remaining Gaps:**
1. Enhanced creation form with product dropdown
2. Wireframe/Styled canvas toggle
3. Canvas interactive editing (inline edit, zoom)
4. Auto-save system
5. One-pager history sidebar
6. Brand voice integration in AI prompts

## Deployment Architecture

**Target Platform:** Vercel (both frontend and backend)
- Frontend: Static hosting with Vite build output
- Backend: Serverless Functions (FastAPI adapter required)
- Database: MongoDB Atlas
- AI: OpenAI API (cloud)

**Note:** Playwright requires special configuration for serverless environments. Consider migrating to cloud PDF generation service for production.

## Additional Resources

- API Documentation: http://localhost:8000/docs (when running)
- Gap Analysis: `DevDocuments/WEEK_2_MVP_GAP_ANALYSIS.md`
- Main README: Setup instructions and tech stack details
