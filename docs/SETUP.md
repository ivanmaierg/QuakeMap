# 🛠 Development Environment Setup

## Prerequisites

### Required Software
- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (install via `npm install -g pnpm`)
- **Git**: Version control system
- **VS Code**: Recommended code editor with extensions

### Required Accounts
- **Cloudflare**: For Workers deployment and domain management
- **Neon**: For PostgreSQL database hosting
- **Vercel/Netlify**: For frontend deployment
- **GitHub**: For code repository and CI/CD

### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "svelte.svelte-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

## Installation Steps

### 1. Clone Repository
```bash
git clone <repository-url>
cd quake-map
```

### 2. Install Dependencies
```bash
# Install all dependencies across the monorepo
pnpm install

# Verify installation
pnpm --version
node --version
```

### 3. Environment Configuration

#### Create Environment Files
```bash
# Root environment file
cp .env.example .env

# API environment file
cp apps/api/.env.example apps/api/.env

# Web environment file
cp apps/web/.env.example apps/web/.env
```

#### Configure Environment Variables

**Root `.env`:**
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"
NEON_DATABASE_URL="postgresql://username:password@host:port/database"

# API
API_BASE_URL="http://localhost:8787"
USGS_API_URL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary"

# Frontend
PUBLIC_API_URL="http://localhost:8787"
```

**`apps/api/.env`:**
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Cloudflare Workers
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"

# USGS API
USGS_API_URL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary"
```

**`apps/web/.env`:**
```env
# API Configuration
PUBLIC_API_URL="http://localhost:8787"
PUBLIC_API_VERSION="v1"
```

### 4. Database Setup

#### Create Neon Database
1. Sign up at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in your environment files

#### Run Database Migrations
```bash
# Generate migration files
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (optional)
pnpm db:studio
```

### 5. Cloudflare Workers Setup

#### Install Wrangler CLI
```bash
npm install -g wrangler
```

#### Authenticate with Cloudflare
```bash
wrangler login
```

#### Configure Workers
```bash
cd apps/api
wrangler dev
```

### 6. Development Server Setup

#### Start All Services
```bash
# Start all apps in development mode
pnpm dev
```

#### Start Individual Services
```bash
# Frontend only
pnpm dev:web

# Backend only
pnpm dev:api

# Database studio
pnpm db:studio
```

## Development Workflow

### Available Scripts

#### Root Level Commands
```bash
# Development
pnpm dev              # Start all apps
pnpm dev:web          # Start frontend only
pnpm dev:api          # Start backend only
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm format           # Format all code

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed database with test data

# Deployment
pnpm deploy:api       # Deploy API to Cloudflare Workers
pnpm deploy:web       # Deploy frontend to Vercel/Netlify
```

#### Package-Specific Commands
```bash
# Frontend (apps/web)
cd apps/web
pnpm dev              # Start SvelteKit dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm test             # Run tests

# Backend (apps/api)
cd apps/api
pnpm dev              # Start Hono dev server
pnpm build            # Build for Workers
pnpm deploy           # Deploy to Cloudflare Workers
```

### Code Organization

#### Frontend Structure
```
apps/web/
├─ src/
│  ├─ lib/            # Shared components and utilities
│  │  ├─ components/  # Reusable Svelte components
│  │  ├─ stores/      # Svelte stores for state management
│  │  ├─ utils/       # Utility functions
│  │  └─ types/       # TypeScript type definitions
│  ├─ routes/         # SvelteKit pages and API routes
│  │  ├─ +layout.svelte
│  │  ├─ +page.svelte
│  │  └─ api/         # Server-side API routes
│  └─ app.html        # Main HTML template
├─ static/            # Static assets
└─ package.json
```

#### Backend Structure
```
apps/api/
├─ src/
│  ├─ routes/         # API route handlers
│  │  ├─ quakes.ts    # Earthquake endpoints
│  │  ├─ health.ts    # Health check
│  │  └─ index.ts     # Route registration
│  ├─ workers/        # Background workers
│  │  └─ cron.ts      # CRON job for data fetching
│  ├─ services/       # Business logic
│  │  ├─ database.ts  # Database operations
│  │  └─ usgs.ts      # USGS API integration
│  ├─ middleware/     # Custom middleware
│  └─ index.ts        # Worker entry point
└─ package.json
```

### Testing Setup

#### Unit Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

#### Integration Testing
```bash
# Test API endpoints
pnpm test:api

# Test frontend components
pnpm test:web

# End-to-end testing
pnpm test:e2e
```

### Debugging

#### Frontend Debugging
- Use browser dev tools
- Svelte dev tools extension
- Console logging with `console.log()`
- SvelteKit dev mode with hot reload

#### Backend Debugging
- Cloudflare Workers dev tools
- Console logging in Workers
- Wrangler dev mode with local debugging
- Database query logging

#### Database Debugging
- Drizzle Studio for visual database management
- Query logging in development
- Database connection testing
- Migration verification

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Test database connection
pnpm db:test

# Reset database
pnpm db:reset

# Check migration status
pnpm db:status
```

#### Build Issues
```bash
# Clean all build artifacts
pnpm clean

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Clear pnpm cache
pnpm store prune
```

#### Cloudflare Workers Issues
```bash
# Check Workers status
wrangler whoami

# View Workers logs
wrangler tail

# Test Workers locally
wrangler dev --local
```

### Performance Optimization

#### Frontend Performance
- Use SvelteKit's built-in optimizations
- Implement lazy loading for components
- Optimize bundle size with code splitting
- Use CDN for static assets

#### Backend Performance
- Optimize database queries
- Implement caching strategies
- Use Cloudflare Workers edge computing
- Monitor API response times

#### Database Performance
- Add appropriate indexes
- Optimize query patterns
- Use connection pooling
- Monitor query performance

## Deployment

### Staging Environment
```bash
# Deploy to staging
pnpm deploy:staging

# Run staging tests
pnpm test:staging
```

### Production Environment
```bash
# Deploy to production
pnpm deploy:production

# Monitor production
pnpm monitor:production
```

### Environment-Specific Configuration
- Use different environment variables for each stage
- Configure different database instances
- Set up separate Cloudflare Workers for staging/production
- Use different API endpoints for each environment
