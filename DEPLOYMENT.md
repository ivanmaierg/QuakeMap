# Deployment Guide

This guide explains how to deploy the QuakeMap application to different environments.

## Environment Configuration

The project supports two environments:
- **Development**: For testing and development purposes
- **Production**: For live deployment

## Environment Variables

Both environments require the `DATABASE_URL` environment variable to be set as a secret in Cloudflare Workers.

### Setting Up Environment Variables

1. **For Development Environment:**
   ```bash
   # Set the DATABASE_URL secret for development
   wrangler secret put DATABASE_URL --env development
   ```

2. **For Production Environment:**
   ```bash
   # Set the DATABASE_URL secret for production  
   wrangler secret put DATABASE_URL --env production
   ```

## Deployment Commands

### Development Environment

Deploy to development environment:
```bash
# From root directory
pnpm deploy:api:dev

# Or from apps/api directory
pnpm deploy:dev
```

### Production Environment

Deploy to production environment:
```bash
# From root directory
pnpm deploy:api:prod

# Or from apps/api directory
pnpm deploy:prod
```

### Default Deployment

The default deploy command deploys to production:
```bash
# From root directory
pnpm deploy:api

# Or from apps/api directory
pnpm deploy
```

## Development Server

### Development Environment
```bash
# From root directory
pnpm dev:api

# Or from apps/api directory
pnpm dev
```

### Production Environment (Local Testing)
```bash
# From apps/api directory
pnpm dev:prod
```

## Environment Differences

| Feature | Development | Production |
|---------|-------------|------------|
| Worker Name | `quake-map-dev` | `quake-map` |
| API Name | `quake-map-api-dev` | `quake-map-api` |
| CORS Origins | `http://localhost:5173,http://localhost:3000` | `https://quake-map.vercel.app,https://quake-map.netlify.app` |
| Environment | `development` | `production` |
| Project Name | `QuakeMap API Dev` | `QuakeMap API` |

## Database Setup

Make sure to set up your database connection string as a secret:

1. Get your Neon database connection string
2. Set it as a secret for the appropriate environment:

```bash
# For development
wrangler secret put DATABASE_URL --env development
# Enter your development database URL when prompted

# For production
wrangler secret put DATABASE_URL --env production
# Enter your production database URL when prompted
```

## Troubleshooting

### Database Connection Error
If you see `DATABASE_URL or NEON_DATABASE_URL environment variable is required`, make sure you've set the DATABASE_URL secret:

```bash
wrangler secret put DATABASE_URL --env production
```

### Worker Name Mismatch
If you see a worker name mismatch warning, it's expected when deploying from CI/CD. The system will use the correct name based on your configuration.

## CI/CD Integration

For automated deployments, make sure to:

1. Set the `DATABASE_URL` secret in your Cloudflare Workers dashboard
2. Use the appropriate deployment command for your target environment
3. The CI system will automatically use the production environment if no environment is specified

## Next Steps

After deployment, your API will be available at:
- Development: `https://quake-map-dev.your-subdomain.workers.dev`
- Production: `https://quake-map.your-subdomain.workers.dev`

Make sure to update your frontend configuration to point to the correct API endpoint for each environment.
