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
- **API**: Node.js with Express/Fastify (TypeScript)
- **Database**: PostgreSQL for structured data, Redis for caching
- **AI Integration**: OpenAI GPT-4, Anthropic Claude
- **File Storage**: AWS S3 or Cloudinary for assets
- **Background Jobs**: Bull Queue for async AI processing

### Infrastructure
- **Frontend Hosting**: Vercel or Netlify
- **Backend Hosting**: AWS, Google Cloud, or Railway
- **Monitoring**: Sentry for errors, DataDog/New Relic for performance
- **Security**: JWT authentication, API rate limiting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis instance
- AI service API keys (OpenAI, Anthropic)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marketing-one-pager
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment templates
   cp .env.example .env
   
   # Configure your environment variables:
   # - Database connection strings
   # - AI service API keys
   # - Authentication secrets
   # - File storage credentials
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   npm run db:migrate
   
   # Seed with sample templates
   npm run db:seed
   ```

5. **Development Servers**
   ```bash
   # Start backend API (port 3001)
   npm run dev:api
   
   # Start frontend app (port 3000)
   npm run dev:web
   
   # Start background job processing
   npm run dev:workers
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

```
POST /api/v1/one-pagers                 # Create new project
GET  /api/v1/one-pagers/:id             # Get project details
PUT  /api/v1/one-pagers/:id             # Update project
POST /api/v1/one-pagers/:id/generate    # Generate AI layout
POST /api/v1/one-pagers/:id/refine      # Refine with feedback
GET  /api/v1/one-pagers/:id/versions    # Version history
POST /api/v1/one-pagers/:id/export      # Export final output
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