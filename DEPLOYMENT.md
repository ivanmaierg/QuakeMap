# Deployment Guide

This guide explains how to deploy the QuakeMap application to different environments.

## Environment Configuration

The project supports two environments:
- **Development**: For testing and development purposes
- **Production**: For live deployment

## Environment Variables

Both environments require the `DATABASE_URL` environment variable to be configured in the wrangler.jsonc files.

### Setting Up Environment Variables

1. **Update Development Environment:**
   Edit `apps/api/wrangler.jsonc` and replace `postgresql://your-dev-db-connection-string` with your actual development database URL.

2. **Update Production Environment:**
   Edit `apps/api/wrangler.jsonc` and replace `postgresql://your-prod-db-connection-string` with your actual production database URL.

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

Make sure to configure your database connection string in the wrangler configuration:

1. Get your Neon database connection string
2. Update the appropriate environment in `apps/api/wrangler.jsonc`:

```jsonc
{
  "env": {
    "development": {
      "vars": {
        "DATABASE_URL": "postgresql://your-actual-dev-connection-string"
      }
    },
    "production": {
      "vars": {
        "DATABASE_URL": "postgresql://your-actual-prod-connection-string"
      }
    }
  }
}
```

## Troubleshooting

### Database Connection Error
If you see `DATABASE_URL or NEON_DATABASE_URL environment variable is required`, make sure you've updated the DATABASE_URL in your `apps/api/wrangler.jsonc` file for the appropriate environment.

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
