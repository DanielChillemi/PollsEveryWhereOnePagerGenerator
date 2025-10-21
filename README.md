# AI-Powered Marketing One-Pager Co-Creation Tool

> **Note**: This project was built for the AI Native Demo Day in partnership with Poll Everywhere. It demonstrates an iterative, human-in-the-loop approach to AI-powered marketing material creation.

## Project Overview

This MarTech (Marketing Technology) tool helps teams create professional marketing one-pagers through an AI-powered, iterative workflow. Unlike traditional "one-shot" AI generation tools, this system generates simple drafts and refines them step-by-step based on human feedback, with full version control and multiple export options.

### Key Features

- **Iterative AI Design**: Start with structured input or natural language prompts, progressively enhance with human feedback
- **Version Control**: Complete version history with ability to restore previous iterations
- **Interactive Canvas Editing**: Drag-and-drop section reordering, inline editing, and real-time auto-save
- **Wireframe/Styled Modes**: Toggle between low-fidelity wireframes and fully-styled branded views
- **Professional PDF Export**: Export-ready marketing materials with 4 template styles and 3 page formats
- **Brand Kit Integration**: Store brand colors, fonts, logos, and products with automatic styling application
- **Product Auto-Fill**: Select from pre-configured products to auto-populate content fields
- **Real-Time Save Status**: Visual feedback for save operations with timestamps

## Target Users

- **Marketing Teams**: Content marketers, product marketers, marketing coordinators
- **Sales Professionals**: Account executives who need sales enablement materials
- **Small Business Owners**: Entrepreneurs without dedicated design resources
- **Agencies**: Marketing consultants creating materials for multiple clients

## Problem Solved

Marketing teams struggle to create polished collateral quickly, especially when design refinement is needed. Existing tools don't handle iterative layout and styling tweaks well, and LLMs alone lack the visual understanding to produce usable one-pagers in a single attempt. This tool bridges that gap with a human-in-the-loop workflow.

## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **State Management**:
  - Zustand for authentication state (persisted to localStorage)
  - TanStack Query v5 for server state with automatic caching
- **UI Library**: Chakra UI v3 with modern components
- **Routing**: React Router v7
- **Drag & Drop**: @dnd-kit for section reordering
- **Date Formatting**: date-fns for relative timestamps
- **Build Tool**: Vite with hot module replacement

### Backend
- **API**: Python 3.13+ FastAPI (async/await)
- **Database**: MongoDB (database: `marketing_onepager`)
  - Collections: `users`, `brand_kits`, `onepagers`
- **Authentication**: JWT tokens with bcrypt password hashing
  - Access tokens: 8-hour expiration
  - Refresh tokens: 7-day expiration
- **AI Integration**: OpenAI GPT-4 via official API
- **PDF Generation**: Playwright (headless Chromium) with Jinja2 templates

### Infrastructure
- **Frontend Hosting**: Vercel (recommended)
- **Backend Hosting**: Vercel Serverless Functions (FastAPI adapter required)
- **Database**: MongoDB Atlas (cloud) or local MongoDB
- **Monitoring**: Sentry for errors, DataDog/New Relic for performance (optional)
- **Security**: JWT authentication, CORS middleware, API rate limiting

## Getting Started

### Prerequisites

- **Python 3.13+** with pip
- **Node.js 18+** with npm
- **MongoDB** (local installation or Atlas cloud account)
- **OpenAI API Key** (for GPT-4 access)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DanielChillemi/PollsEveryWhereOnePagerGenerator.git
   cd PollsEveryWhereOnePagerGenerator
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment (recommended)
   python -m venv .venv

   # Activate virtual environment
   source .venv/bin/activate  # macOS/Linux
   # .venv\Scripts\activate  # Windows

   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Setup**

   Create `.env` file in the root directory:
   ```bash
   # MongoDB Connection
   MONGODB_URL=mongodb://localhost:27017
   # Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net

   # JWT Configuration
   JWT_SECRET_KEY=your-secret-key-here-generate-random-string
   JWT_REFRESH_SECRET_KEY=your-refresh-secret-key-here-generate-random-string

   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-openai-api-key-here

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

5. **Database Setup**
   ```bash
   # MongoDB will auto-create collections on first use
   # No migrations needed for MongoDB

   # Start MongoDB locally (if not using Atlas)
   # macOS: brew services start mongodb-community
   # Linux: sudo systemctl start mongod
   # Windows: net start MongoDB
   ```

### Running the Application

1. **Start Backend Server** (Terminal 1)
   ```bash
   # From project root, with virtual environment activated
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

   # View API documentation at:
   # http://localhost:8000/docs (Swagger UI)
   # http://localhost:8000/redoc (ReDoc)
   ```

2. **Start Frontend Server** (Terminal 2)
   ```bash
   cd frontend
   npm run dev

   # Application available at:
   # http://localhost:5173
   ```

3. **Test the Setup**
   ```bash
   # Health check
   curl http://localhost:8000/health

   # Run authentication test
   python test_auth_flow.py
   ```

## Application Features

### 1. Brand Kit Management
- **Create Multiple Brand Kits**: Each user can create unlimited brand kits for different products/brands
- **Brand Assets**: Store colors, fonts, logos, and brand voice
- **Product Library**: Define products with default content (problem, solution, features, benefits)
- **Soft Delete**: Brand kits can be deactivated without permanent deletion

### 2. OnePager Creation Workflow

#### Option A: Structured Form Input
1. Enter basic information (title, target audience)
2. Select brand kit and optional product (auto-fills content)
3. Fill out structured fields:
   - Problem statement
   - Solution description
   - Features list
   - Benefits list
   - Integrations list
   - Social proof
   - Call-to-action (text + URL)
4. Backend auto-generates sections from structured data

#### Option B: AI-Powered Generation
1. Select brand kit
2. Provide natural language prompt (e.g., "Create a one-pager for our new SaaS analytics platform")
3. AI generates complete content structure using GPT-4
4. Refine through iterative feedback

### 3. Interactive Canvas Editing
- **Drag & Drop**: Reorder sections with visual feedback
- **Inline Editing**: Click to edit section content directly
- **Section Management**: Add, edit, or delete sections
- **Auto-Save**: Automatic save with visual status indicator
- **Last Saved Timestamp**: See exactly when changes were saved

### 4. AI Iteration System
- **Feedback Loop**: Provide natural language feedback to refine content
- **Context Preservation**: AI maintains brand context and previous decisions
- **Version History**: Every AI iteration creates a snapshot
- **Smart Parsing**: Handles nested and flat AI response structures

### 5. Version Control
- **Automatic Snapshots**: Created after each AI iteration
- **Timeline View**: Visual history with timestamps and descriptions
- **One-Click Restore**: Revert to any previous version
- **Restore Documentation**: Restore actions create new snapshots

### 6. Wireframe/Styled Modes
- **Wireframe Mode**: Low-fidelity view emphasizing structure
  - Paper texture background
  - Hand-drawn aesthetic with dashed borders
  - Grayscale filter for content focus
  - Section type labels
- **Styled Mode**: Full brand styling with colors, fonts, and visual polish
- **Smooth Transitions**: 0.4s animated toggle between modes

### 7. PDF Export
- **4 Template Styles**:
  - **Minimalist**: Clean 2-column layout with subtle gradients
  - **Bold**: Diagonal/asymmetric design with strong visual hierarchy
  - **Business**: Data-focused grid with charts and metrics
  - **Product**: Visual showcase with large images and feature highlights
- **3 Page Formats**: Letter, A4, Tabloid
- **Brand Integration**: Automatic application of brand colors and fonts
- **Single-Page Layout**: Optimized for professional printing
- **Download Ready**: Generates PDF and triggers browser download

## API Documentation

### Authentication Endpoints

**User Registration**
```
POST /api/v1/auth/signup
Body: {
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
Response: {
  "id": "...",
  "email": "user@example.com",
  "full_name": "John Doe"
}
```

**User Login**
```
POST /api/v1/auth/login
Body: {
  "email": "user@example.com",
  "password": "securepassword"
}
Response: {
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

**Refresh Access Token**
```
POST /api/v1/auth/refresh
Body: {
  "refresh_token": "eyJ..."
}
Response: {
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

**Get Current User**
```
GET /api/v1/auth/me
Headers: Authorization: Bearer {access_token}
Response: {
  "id": "...",
  "email": "user@example.com",
  "full_name": "John Doe"
}
```

### Brand Kit Endpoints

**Create Brand Kit**
```
POST /api/v1/brand-kits
Headers: Authorization: Bearer {access_token}
Body: {
  "name": "Acme Corp",
  "color_palette": {
    "primary": "#FF5733",
    "secondary": "#33C3FF",
    "accent": "#FFC300"
  },
  "typography": {
    "heading_font": "Montserrat",
    "body_font": "Open Sans"
  },
  "logo_url": "https://example.com/logo.png",
  "brand_voice": "Energetic and innovative with a friendly tone",
  "products": [
    {
      "name": "Product A",
      "description": "Our flagship product",
      "default_problem": "Challenge description",
      "default_solution": "Solution description",
      "features": ["Feature 1", "Feature 2"],
      "benefits": ["Benefit 1", "Benefit 2"]
    }
  ]
}
```

**List User's Brand Kits**
```
GET /api/v1/brand-kits/me
Headers: Authorization: Bearer {access_token}
Response: [
  {
    "id": "...",
    "name": "Acme Corp",
    "color_palette": {...},
    "products": [...]
  }
]
```

**Update Brand Kit**
```
PUT /api/v1/brand-kits/{id}
Headers: Authorization: Bearer {access_token}
Body: {
  "name": "Updated Name",
  "products": [...]
}
```

**Delete Brand Kit** (Soft Delete)
```
DELETE /api/v1/brand-kits/{id}
Headers: Authorization: Bearer {access_token}
Response: {"message": "Brand kit deleted successfully"}
```

### OnePager Endpoints

**Create OnePager**
```
POST /api/v1/onepagers
Headers: Authorization: Bearer {access_token}
Body: {
  "title": "Product Launch One-Pager",
  "problem": "Customers struggle with...",
  "solution": "Our product solves this by...",
  "features": ["Feature 1", "Feature 2"],
  "benefits": ["Benefit 1", "Benefit 2"],
  "integrations": ["Salesforce", "Slack"],
  "social_proof": "Trusted by 1000+ companies",
  "cta": {
    "text": "Get Started",
    "url": "https://example.com/signup"
  },
  "brand_kit_id": "...",
  "product_id": "...",  // Optional: auto-fill from product
  "target_audience": "B2B SaaS companies",
  "input_prompt": "Create a modern tech one-pager"  // Optional: AI generation
}
Response: {
  "id": "...",
  "title": "...",
  "content": {
    "headline": "...",
    "subheadline": "...",
    "sections": [...]
  },
  "version_history": []
}
```

**List OnePagers** (Paginated)
```
GET /api/v1/onepagers?skip=0&limit=10&search=keyword
Headers: Authorization: Bearer {access_token}
Response: {
  "items": [...],
  "total": 25,
  "skip": 0,
  "limit": 10
}
```

**Get OnePager Details**
```
GET /api/v1/onepagers/{id}
Headers: Authorization: Bearer {access_token}
Response: {
  "id": "...",
  "title": "...",
  "content": {
    "headline": "...",
    "sections": [...]
  },
  "version_history": [...],
  "brand_kit": {...}
}
```

**Update OnePager Metadata**
```
PATCH /api/v1/onepagers/{id}
Headers: Authorization: Bearer {access_token}
Body: {
  "title": "Updated Title",
  "brand_kit_id": "..."
}
```

**Direct Content Update** (No AI)
```
PATCH /api/v1/onepagers/{id}/content
Headers: Authorization: Bearer {access_token}
Body: {
  "sections": [
    {
      "id": "section-1",
      "type": "hero",
      "title": "Welcome",
      "content": {"headline": "...", "description": "..."},
      "order": 1
    }
  ]
}
```

**AI Iteration** (Refine with Feedback)
```
PUT /api/v1/onepagers/{id}/iterate
Headers: Authorization: Bearer {access_token}
Body: {
  "feedback": "Make the headline more exciting and add a pricing section"
}
Response: {
  "id": "...",
  "content": {
    "sections": [...]  // Updated by AI
  },
  "version_history": [...]  // New snapshot added
}
```

**Restore Previous Version**
```
POST /api/v1/onepagers/{id}/restore/{version}
Headers: Authorization: Bearer {access_token}
Response: {
  "id": "...",
  "content": {...},  // Restored content
  "version_history": [...]  // Restore action documented
}
```

**Export to PDF**
```
GET /api/v1/onepagers/{id}/export/pdf?format=letter&template=minimalist
Headers: Authorization: Bearer {access_token}
Query Parameters:
  - format: letter | a4 | tabloid
  - template: minimalist | bold | business | product
Response: application/pdf (file download)
```

**Delete OnePager**
```
DELETE /api/v1/onepagers/{id}
Headers: Authorization: Bearer {access_token}
Response: {"message": "OnePager deleted successfully"}
```

### System Endpoints

```
GET /                    # API information
GET /health             # Health check with database status
GET /docs               # Swagger UI documentation
GET /redoc              # ReDoc documentation
```

## Architecture Principles

### Core Design Philosophy

**Never implement "one-shot" AI generation.** Always support iterative refinement with human feedback at each step.

### Content Section Polymorphism

`ContentSection.content` can be multiple types:
- **Hero sections**: `{headline: str, subheadline?: str, description?: str}` OR plain `str`
- **Button sections**: `{text: str, url: str}` OR plain `str`
- **List sections**: `List[str]`
- **Text sections**: `str`

Frontend components must handle type checking before rendering.

### Version History System

- **Automatic snapshots** created after AI iterations
- Each snapshot includes: version number, content, layout, timestamp, change description
- Restore creates new snapshot documenting the restore action
- Frontend displays timeline sorted newest-first

### Direct vs AI Updates

- **Direct updates** (`PATCH /content`): Immediate user edits, no AI processing, no version snapshots
- **AI iterations** (`PUT /iterate`): AI refinement, creates version snapshot
- This separation enables responsive editing while preserving AI workflow history

## Development Workflow

### Code Organization

```
PollsEveryWhereOnePagerGenerator/
├── backend/
│   ├── auth/                   # JWT authentication
│   ├── brand_kits/             # Brand kit CRUD
│   ├── onepagers/              # OnePager CRUD + AI iteration
│   ├── services/               # AI service (OpenAI), PDF generation
│   ├── database/               # MongoDB connection
│   ├── models/                 # Pydantic schemas
│   └── templates/pdf/          # Jinja2 PDF templates
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── auth/          # Login, signup forms
│   │   │   ├── brand-kit/     # Brand kit management
│   │   │   ├── onepager/      # Canvas, sections, version history
│   │   │   └── common/        # Shared components (save status, etc.)
│   │   ├── pages/             # Route pages
│   │   ├── hooks/             # TanStack Query custom hooks
│   │   ├── services/          # API client services
│   │   ├── stores/            # Zustand state management
│   │   └── types/             # TypeScript definitions
└── docs/                       # Additional documentation
```

### Frontend State Management

- **Zustand** (`stores/authStore.ts`): JWT tokens, user profile (persisted to localStorage)
- **TanStack Query v5**: Server state with automatic caching/invalidation
  - Query keys: `['onepager', id]`, `['onepagers', {skip, limit}]`, `['brand-kits']`
  - Mutations automatically invalidate relevant queries on success
- **Component-local state**: UI state (forms, modals, edit modes)

### API Client Pattern

All API calls wrapped in custom hooks using TanStack Query:

```typescript
// Example: hooks/useOnePager.ts
export const useUpdateOnePagerContent = () => {
  const token = useAuthStore(state => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; data: any }) =>
      onepagerService.updateContent(data.id, data.data, token!),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['onepager', variables.id]);
      queryClient.invalidateQueries(['onepagers']);
    },
  });
};
```

### Testing Strategy

- **Backend**: FastAPI TestClient for endpoint testing
- **Frontend**:
  - Component tests with mock API responses
  - Integration tests for key workflows
  - AI testing with response validation

## Deployment

### Production Checklist

- [ ] Environment variables configured securely (use `.env.production`)
- [ ] MongoDB Atlas cluster set up with proper access controls
- [ ] OpenAI API key configured with usage limits
- [ ] CORS origins configured for production domain
- [ ] SSL certificates installed (handled by Vercel)
- [ ] Monitoring and alerting configured (Sentry, DataDog)
- [ ] Rate limiting configured for API endpoints
- [ ] Backup procedures for MongoDB implemented

### Vercel Deployment

**Frontend:**
```bash
cd frontend
npm run build
# Deploy via Vercel CLI or GitHub integration
```

**Backend:**
- Requires FastAPI adapter for Vercel Serverless Functions
- Configure `vercel.json` for API routes
- Note: Playwright requires special serverless configuration

**Alternative for PDF Generation:**
Consider cloud PDF services (e.g., DocRaptor, PDFShift) for production if Playwright serverless setup is complex.

### Environment Variables (Production)

```bash
# MongoDB Atlas
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/marketing_onepager

# JWT (use strong random strings)
JWT_SECRET_KEY=<generate-256-bit-random-string>
JWT_REFRESH_SECRET_KEY=<generate-256-bit-random-string>

# OpenAI
OPENAI_API_KEY=sk-<production-key>

# CORS
FRONTEND_URL=https://yourdomain.com
```

### Scaling Considerations

- **OpenAI API Costs**: Implement caching and quota management
- **Database Performance**: Index optimization for `user_id`, `created_at` fields
- **PDF Generation**: Consider cloud PDF service for better reliability
- **Asset Storage**: Consider CDN for logo/image hosting (currently inline URLs)

## Contributing

### Code Quality Standards

- Follow TypeScript strict mode requirements
- Write comprehensive tests for AI integration
- Use semantic commit messages (e.g., `feat:`, `fix:`, `docs:`)
- Test across different user personas (marketers, sales, admins)

### AI Workflow Guidelines

- Never implement "one-shot" generation features
- Always provide feedback mechanisms for AI outputs
- Preserve user context across sessions
- Implement graceful fallbacks for AI failures
- Focus on marketing team usability over technical complexity

## Project Documentation

- [CLAUDE.md](CLAUDE.md) - Comprehensive development guide for Claude Code
- [Quickstart Guide](QUICKSTART.md) - Quick setup instructions
- [API Documentation](QUICKSTART_API.md) - Detailed API reference
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Project status overview
- [Architecture Principles](docs/ARCHITECTURE_PRINCIPLES.md) - Architectural guidelines
- [Backend Implementation](docs/BACKEND_IMPLEMENTATION.md) - Backend deep dive

## Support and Resources

### Demo Day Resources
- **Project Partner**: Poll Everywhere (Contact: Mateo Williford)
- **Project Category**: MarTech / Sales Enablement / Generative AI
- **Success Metrics**: Functional co-creation workflow, professional output quality
- **Key Questions Explored**: Iterative AI refinement, version control, marketing team integration

### Development Resources
- API Docs: http://localhost:8000/docs (when running locally)
- MongoDB Docs: https://www.mongodb.com/docs/
- OpenAI API Docs: https://platform.openai.com/docs/
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Query Docs: https://tanstack.com/query/latest

---

**Built with care for AI Native Demo Day** - Transforming how marketing teams create professional collateral through human-AI collaboration.
