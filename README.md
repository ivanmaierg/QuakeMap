# 🌎 QuakeMap — Learning Project

## 🎯 Project Overview

Build a real-time map visualization application that displays recent earthquakes worldwide. This project serves as a comprehensive learning experience combining modern web technologies across the full stack.

### 🎓 Learning Objectives

Master the integration of:
- **Frontend**: SvelteKit with shadcn-svelte components (UI, pages, client-side interactivity)
- **Backend**: Hono.js API running on Cloudflare Workers
- **Database**: Neon (serverless Postgres) with Drizzle ORM
- **Architecture**: Turborepo monorepo structure & shared packages
- **UI Components**: shadcn-svelte for beautiful, accessible components
- **Visualization**: MapLibre GL JS for rendering GeoJSON earthquake data
- **Data Source**: USGS Earthquake GeoJSON Feed (free, updated hourly)

### 📊 Key Features

- Real-time earthquake data visualization on an interactive map
- Filter earthquakes by magnitude, time range, and geographic bounds
- Responsive design with modern UI/UX principles
- Serverless architecture with automatic data synchronization
- Performance-optimized with efficient data fetching and caching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Git for version control
- Cloudflare account for Workers
- Neon account for PostgreSQL database
- Vercel/Netlify account for frontend deployment

### Installation
```bash
# Clone and setup
git clone <repository-url>
cd quake-map
pnpm install

# Development
pnpm dev          # Start all apps in development mode
pnpm dev:web      # Start only frontend
pnpm dev:api      # Start only backend
pnpm build        # Build all packages
pnpm test         # Run all tests

# Database
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Drizzle Studio
```

## 📚 Documentation

- **[Architecture](./docs/ARCHITECTURE.md)** - Technical architecture and monorepo structure
- **[API Reference](./docs/API.md)** - API endpoints and database schema
- **[Development Roadmap](./docs/ROADMAP.md)** - Development phases and milestones
- **[Features](./docs/FEATURES.md)** - Core features and stretch goals
- **[Setup Guide](./docs/SETUP.md)** - Detailed development environment setup

## 🛠 Technology Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo for monorepo management
- **Frontend**: SvelteKit + Tailwind CSS + shadcn-svelte + MapLibre GL JS
- **Backend**: Hono.js + Cloudflare Workers
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Deployment**: Cloudflare Workers + Vercel/Netlify

## 📖 Learning Resources

### Documentation
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [shadcn-svelte Documentation](https://www.shadcn-svelte.com/)
- [Hono.js Guide](https://hono.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

### USGS Earthquake Data
- [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
- [GeoJSON Specification](https://geojson.org/)
- [Earthquake Magnitude Scale](https://www.usgs.gov/natural-hazards/earthquake-hazards/science/earthquake-magnitude-energy-release-and-shaking-intensity)

---

> 💡 **Project Scope**: This project is designed to be completed over a weekend while providing comprehensive exposure to modern full-stack development practices, including monorepo management, serverless architecture, real-time data processing, and interactive data visualization.
# Trigger GitHub Actions
