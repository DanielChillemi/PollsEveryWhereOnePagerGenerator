# AI-Powered Marketing One-Pager Co-Creation Tool

> **Note**: This project was built for the AI Native Demo Day in partnership with Poll Everywhere. It demonstrates an iterative, human-in-the-loop approach to AI-powered marketing material creation.

## Project Overview

This MarTech (Marketing Technology) tool helps teams create professional marketing one-pagers through an AI-powered, iterative workflow. Unlike traditional "one-shot" AI generation tools, this system generates simple drafts (ASCII layouts, wireframes) and refines them step-by-step based on human feedback.

### Key Features

- **Iterative AI Design**: Start with low-fidelity drafts, progressively enhance with human input
- **Marketing-Focused**: Built specifically for marketing teams and sales enablement
- **Real-Time Collaboration**: Live preview updates and team workflow support  
- **Professional Output**: Export-ready marketing materials in multiple formats
- **Template Library**: Industry-specific templates and customizable layouts

## Target Users

- **Marketing Teams**: Content marketers, product marketers, marketing coordinators
- **Sales Professionals**: Account executives who need sales enablement materials
- **Small Business Owners**: Entrepreneurs without dedicated design resources
- **Agencies**: Marketing consultants creating materials for multiple clients

## Problem Solved

Marketing teams struggle to create polished collateral quickly, especially when design refinement is needed. Existing tools don't handle iterative layout and styling tweaks well, and LLMs alone lack the visual understanding to produce usable one-pagers in a single attempt.

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand or Redux Toolkit
- **Styling**: Tailwind CSS + Headless UI components
- **Real-time Updates**: Socket.io for live collaboration
- **Export**: html2canvas + jsPDF for professional output

### Backend
- **API**: Python FastAPI (async/await)
- **Database**: MongoDB Atlas for flexible document storage
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: Google Gemini Pro API, OpenAI GPT-4
- **Canva Integration**: Canva Connect API for design export
- **File Storage**: AWS S3 or Cloudinary for assets

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Vercel Serverless Functions (FastAPI)
- **Database**: MongoDB Atlas (cloud)
- **Monitoring**: Sentry for errors, DataDog/New Relic for performance
- **Security**: JWT authentication, CORS middleware, API rate limiting

## Getting Started

### Prerequisites

- Python 3.13+ with pip
- MongoDB (local installation or Atlas cloud account)
- AI service API keys (Google Gemini, OpenAI)
- Canva Connect API credentials (for design export)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marketing-one-pager
   ```

2. **Install dependencies**
   ```bash
   # Install backend Python dependencies
   pip install -r requirements.txt
   
   # Or use virtual environment (recommended)
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Configure your environment variables:
   # - MONGODB_URL: MongoDB connection string
   # - JWT_SECRET_KEY: Secret for JWT tokens
   # - JWT_REFRESH_SECRET_KEY: Secret for refresh tokens
   # - GEMINI_API_KEY: Google Gemini API key
   # - CANVA_API_BASE_URL: Canva Connect API URL
   # - CANVA_CLIENT_ID: Canva app client ID
   # - CANVA_CLIENT_SECRET: Canva app secret
   ```

4. **Database Setup**
   ```bash
   # MongoDB will auto-create collections on first use
   # No migrations needed for MongoDB
   
   # Start MongoDB locally (if not using Atlas)
   # Windows: net start MongoDB
   # macOS: brew services start mongodb-community
   # Linux: sudo systemctl start mongod
   ```

5. **Development Server**
   ```bash
   # Start FastAPI backend with auto-reload (port 8000)
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   
   # Or use Python module
   python -m uvicorn backend.main:app --reload
   
   # Test the API
   # Open http://localhost:8000/docs for interactive API documentation
   # Open http://localhost:8000/health for health check
   
   # Run authentication tests
   python test_auth_flow.py
   ```

### GitHub Copilot Configuration

This project includes comprehensive GitHub Copilot customization files to improve AI assistance:

- **Instructions Files**: Domain-specific coding guidelines in `.github/instructions/`
- **Prompt Files**: Reusable prompts for common tasks in `.github/prompts/`
- **Main Instructions**: Core project guidelines in `.github/copilot-instructions.md`

To enable these customizations:
1. Enable instruction files in VS Code settings:
   ```json
   {
     "github.copilot.chat.codeGeneration.useInstructionFiles": true,
     "chat.promptFiles": true
   }
   ```

2. Use prompts with `/` command in Copilot Chat:
   - `/generate-one-pager` - Create marketing one-pagers iteratively
   - `/analyze-marketing-content` - Review and optimize content
   - `/create-marketing-templates` - Generate industry-specific templates
   - `/code-review-martech` - Perform marketing technology code reviews
   - `/plan-architecture` - Design system architecture
   - `/debug-ai-workflows` - Troubleshoot AI integration issues

## Development Workflow

### Iterative AI Principles

1. **Start Simple**: Begin with ASCII wireframes or basic layouts
2. **Gather Feedback**: Present options and collect specific user input
3. **Preserve Context**: Maintain design decisions across iterations
4. **Progressive Enhancement**: Add detail and polish incrementally
5. **Enable Backtracking**: Allow users to explore different directions

### Code Organization

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout and wireframe components
│   ├── marketing/      # Marketing-specific components
│   └── ai/            # AI interaction components
├── services/           # Business logic and API integration
│   ├── ai/            # AI service abstractions
│   ├── export/        # Output generation services
│   └── collaboration/ # Real-time features
├── types/             # TypeScript definitions
├── utils/             # Helper functions
└── workflows/         # Human-in-the-loop workflow logic
```

### Testing Strategy

- **Unit Tests**: Core business logic and AI integration
- **Component Tests**: React components with mock AI responses
- **Integration Tests**: End-to-end workflow validation
- **AI Testing**: Response validation and fallback scenarios

## Integration with Marketing Workflows

### Team Collaboration
- Real-time editing with multiple users
- Version control for design iterations
- Comment and feedback systems
- Approval workflows for final assets

### Brand Consistency
- Upload brand guidelines and assets
- Automatic brand compliance checking
- Template customization with brand elements
- Style guide enforcement

### Export and Distribution
- High-resolution PDF and PNG exports
- Web-optimized formats for digital use
- Print-ready outputs with proper margins
- Social media format adaptations

## API Documentation

### Core Endpoints

**Authentication:** ✅ Implemented
```
POST /api/v1/auth/signup                # User registration
POST /api/v1/auth/login                 # User login (get JWT tokens)
POST /api/v1/auth/refresh               # Refresh access token
GET  /api/v1/auth/me                    # Get current user profile
```

**One-Pagers:** 🔜 Coming Soon
```
POST /api/v1/onepagers                  # Create new project
GET  /api/v1/onepagers/:id              # Get project details
PUT  /api/v1/onepagers/:id              # Update project
POST /api/v1/onepagers/:id/generate     # Generate AI layout
POST /api/v1/onepagers/:id/refine       # Refine with feedback
GET  /api/v1/onepagers/:id/versions     # Version history
POST /api/v1/onepagers/:id/export       # Export to Canva/PDF
```

**System:**
```
GET  /                                   # API information
GET  /health                            # Health check with DB status
GET  /docs                              # Interactive API documentation (Swagger UI)
GET  /redoc                             # Alternative API documentation
```

### WebSocket Events

```javascript
// Real-time collaboration events
socket.on('layout-updated', handleLayoutUpdate);
socket.on('user-joined', handleUserJoined);
socket.on('ai-generating', showGeneratingState);
socket.on('generation-complete', handleNewLayout);
```

## Deployment

### Production Checklist

- [ ] Environment variables configured securely
- [ ] Database migrations applied
- [ ] AI service quotas and monitoring set up
- [ ] CDN configured for asset delivery
- [ ] SSL certificates installed
- [ ] Monitoring and alerting configured
- [ ] Backup procedures implemented

### Scaling Considerations

- **AI API Costs**: Implement caching and quota management
- **Database Performance**: Index optimization for large datasets
- **Real-time Features**: Redis cluster for WebSocket scaling
- **Asset Storage**: CDN integration for global distribution
- **Background Processing**: Queue scaling for AI workflows

## Contributing

### Code Quality Standards

- Follow TypeScript strict mode requirements
- Write comprehensive tests for AI integration
- Use semantic commit messages
- Include documentation for marketing team features
- Test across different user personas (marketers, sales, admins)

### AI Workflow Guidelines

- Never implement "one-shot" generation features
- Always provide multiple options when possible
- Preserve user context across sessions
- Implement graceful fallbacks for AI failures
- Focus on marketing team usability over technical complexity

## Support and Resources

### Documentation
- [API Reference](./docs/api.md)
- [Component Library](./docs/components.md)
- [AI Integration Guide](./docs/ai-integration.md)
- [Marketing Workflow Guide](./docs/marketing-workflows.md)

### Demo Day Resources
- **Project Partner**: Poll Everywhere (Contact: Mateo Williford)
- **Project Category**: MarTech / Sales Enablement / Generative AI
- **Success Metrics**: Functional co-creation workflow, professional output quality
- **Key Questions Explored**: Low-fidelity visualization, iterative feedback, marketing team integration

---

Built with ❤️ for AI Native Demo Day - Transforming how marketing teams create professional collateral through human-AI collaboration.