# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-Powered Marketing One-Pager Co-Creation Tool - a MarTech application for iterative, human-in-the-loop marketing material creation. Built for AI Native Demo Day in partnership with Poll Everywhere.

**Key Principle:** Progressive refinement from low-fidelity drafts (ASCII layouts, wireframes) to polished marketing materials, not "one-shot" AI generation.

## Architecture

### Monorepo Structure
```
PollsEveryWhereOnePagerGenerator/
├── backend/          # FastAPI Python backend
├── frontend/         # React + TypeScript + Vite frontend
└── DevDocuments/     # Planning & gap analysis docs
```

### Backend Architecture (Python + FastAPI)

**Tech Stack:** FastAPI, MongoDB, JWT Auth, OpenAI GPT-4, Playwright PDF export

**Key Modules:**
- `auth/` - JWT authentication with bcrypt
- `brand_kits/` - Brand asset management (products, audiences, colors, fonts, voice)
- `onepagers/` - One-pager CRUD and AI iteration
- `services/ai_service.py` - OpenAI integration with brand context
- `services/export_service.py` - Playwright-based PDF generation
- `database/mongodb.py` - MongoDB connection manager

**Important Design Patterns:**
1. **Dependency Injection**: Auth uses `get_current_user()` dependency
2. **Soft Delete**: Brand kits use `is_active` flag, not hard delete
3. **Brand Context**: AI service accepts `brand_context` dict from brand kits
4. **Iterative AI**: Separate endpoints for initial generation (`POST /onepagers`) and refinement (`POST /onepagers/{id}/iterate`)

**Python 3.13 Fix:** Windows requires `ProactorEventLoopPolicy` for Playwright - see `main.py:13-15`

### Frontend Architecture (React + TypeScript)

**Tech Stack:** React 19, TypeScript, Vite, Chakra UI, TanStack Query, Zustand, React Router

**State Management:**
- `stores/authStore.ts` - JWT tokens, user state (Zustand)
- `@tanstack/react-query` - Server state caching

**Key Directories:**
- `pages/` - Route components (Dashboard, Create, Edit, Detail)
- `components/onepager/` - One-pager canvas, sections, drag-drop
- `services/` - API client layers
- `hooks/` - React Query hooks for API calls
- `types/` - TypeScript interfaces

**Critical Components:**
- `pages/CreateOnePager.tsx` - One-pager creation form (matches backend schema)
- `pages/OnePagerDetailPage.tsx` - Canvas editor with AI iteration
- `components/onepager/DraggableSectionList.tsx` - Drag-to-reorder with @dnd-kit
- `components/onepager/sections/` - Section renderers (Hero, Text, Features, etc.)

**Type Safety:** `frontend/src/types/onepager.ts` defines `OnePagerCreateData` matching backend `OnePagerCreate` schema

## Development Commands

### Backend
```bash
# Start development server (auto-reload)
cd PollsEveryWhereOnePagerGenerator
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# View API docs
open http://localhost:8000/docs

# Run auth tests
python test_auth_flow.py

# Python virtual environment
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### Frontend
```bash
# Start dev server (Vite HMR)
cd PollsEveryWhereOnePagerGenerator/frontend
npm run dev

# Open http://localhost:5173

# Build for production
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

### Environment Setup
Backend requires `.env` file with:
- `MONGODB_URL` - MongoDB connection string
- `JWT_SECRET_KEY` - JWT signing key
- `JWT_REFRESH_SECRET_KEY` - Refresh token key
- `OPENAI_API_KEY` - OpenAI API key (required)
- `FRONTEND_URL` - CORS allowed origin (default: http://localhost:5173)

## Critical API Schema Alignment

**Backend Schema** (`backend/onepagers/schemas.py` - OnePagerCreate):
```python
title: str (required)
problem: str (required, 10-2000 chars)
solution: str (required, 10-2000 chars)
features: List[str] (optional)
benefits: List[str] (optional)
cta: dict with {text, url} (required)
product_id: str (optional)
brand_kit_id: str (optional)
target_audience: str (optional)
```

**Frontend Must Match** (`frontend/src/pages/CreateOnePager.tsx`):
- Form state must include all required fields
- Submit payload must exclude empty optional fields
- CTA must be object with `text` and `url` strings

**Common Bug:** Select components with dynamic options can crash if not properly guarded with `Array.isArray()` checks.

## Current Status (Week 2)

**Backend: 100% Complete** ✅
- Authentication, Brand Kits, AI Generation, PDF Export all functional

**Frontend: 80% Complete** ⚠️
- Auth UI, Dashboard, Brand Kit forms, Canvas editor implemented
- **Critical Gaps** (see `DevDocuments/WEEK_2_MVP_GAP_ANALYSIS.md`):
  1. Enhanced One-Pager Creation Form (product dropdown, structured fields)
  2. Canvas Wireframe/Styled Toggle
  3. Canvas Interactive Editing (inline edit, repositioning, zoom)
  4. Auto-Save System
  5. One-Pager History Sidebar
  6. Brand Voice Integration in AI prompts

## Iterative AI Workflow

**Core Loop:**
1. User creates one-pager with structured input (problem, solution, features, etc.)
2. Backend calls OpenAI GPT-4 with brand context
3. AI generates wireframe sections (low-fidelity structure)
4. User provides feedback via iteration panel
5. Backend refines with feedback + previous context
6. Repeat until user satisfied
7. Export to PDF with brand styling

**Never:** Implement single-shot generation without iteration capability.

## PDF Export Architecture

**Technology:** Playwright (headless browser) renders HTML → PDF
- Supports Letter (8.5×11"), A4, Tabloid (11×17") formats
- Applies brand colors, fonts, logo from Brand Kit
- Generates selectable text, high-quality output
- Endpoint: `POST /api/v1/onepagers/{id}/export/pdf?format=letter`

## Known Issues

1. **Browser Cache Battles:** Vite HMR updates don't always clear browser cache
   - Solution: Hard refresh with `Cmd+Shift+R` or clear site data
   - Use incognito mode for testing fresh loads

2. **React "Objects are not valid as React child":** Often caused by:
   - Rendering objects directly instead of strings
   - Missing `Array.isArray()` checks before `.map()`
   - Incorrect component exports (named vs default)

3. **401 Unauthorized on Brand Kit fetch:** JWT token expiry
   - Frontend should handle refresh token flow
   - Check `useAuthStore` for token state

## Development Workflow Guidance

**When Adding New Features:**
1. Check `WEEK_2_MVP_GAP_ANALYSIS.md` for planned work
2. Update both backend schema AND frontend types
3. Test with incognito browser to avoid cache issues
4. Verify API contract with `/docs` Swagger UI

**When Debugging Frontend:**
1. Check browser Console for React errors
2. Verify Network tab for API responses
3. Inspect Zustand store state in React DevTools
4. Check TanStack Query cache for stale data

**When Modifying AI Logic:**
1. Edit `backend/services/ai_service.py`
2. Ensure brand context (colors, fonts, voice) passed to prompts
3. Test with real OpenAI API key, not mocks
4. Preserve conversation history for iteration

## Testing Strategy

**Backend:**
- Use `test_auth_flow.py` for auth validation
- Interactive testing via `/docs` Swagger UI
- MongoDB collections: `users`, `brand_kits`, `onepagers`

**Frontend:**
- Manual testing with browser DevTools
- Type checking with `npx tsc --noEmit`
- API integration testing with real backend

## Deployment Notes

- Backend: Designed for Vercel Serverless Functions (FastAPI)
- Frontend: Vercel static hosting
- Database: MongoDB Atlas cloud
- Monitoring: Configured for Sentry/DataDog (not implemented)

## Additional Resources

- Main README: Comprehensive setup instructions
- Gap Analysis: `DevDocuments/WEEK_2_MVP_GAP_ANALYSIS.md`
- API Docs: http://localhost:8000/docs when backend running
