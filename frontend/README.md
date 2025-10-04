# Marketing One-Pager Frontend

React + TypeScript frontend for the AI-powered marketing one-pager co-creation tool.

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **UI Library**: Chakra UI v3
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Drag & Drop**: dnd-kit
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── marketing/      # Marketing-specific components
│   └── ai/            # AI interaction components
├── pages/              # Page components
├── services/           # Business logic and API integration
│   ├── api/           # API client configuration
│   └── auth/          # Authentication services
├── stores/            # Zustand state stores
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Helper functions
├── theme.ts           # Chakra UI theme configuration
└── main.tsx           # Application entry point
```

## Key Features

### Chakra UI Integration
- Custom theme with brand colors
- Consistent component styling
- Responsive design utilities

### TanStack Query
- Automatic caching and refetching
- Background updates
- Optimistic updates

### Zustand Store
- Authentication state management
- JWT token handling
- User profile data

### API Client
- Axios interceptors for auth tokens
- Automatic token refresh on 401
- Centralized error handling

## Development

### Running the Dev Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Flow

1. User logs in via `/login`
2. JWT tokens stored in localStorage and Zustand store
3. API client automatically adds Bearer token to requests
4. On 401 error, refresh token is used to get new access token
5. If refresh fails, user is redirected to login

## Next Steps

- [ ] Build authentication pages (F1.2)
- [ ] Implement protected routes
- [ ] Create brand kit UI
- [ ] Build one-pager canvas editor
- [ ] Add AI content generation UI
