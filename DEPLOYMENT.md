# Deployment Guide

This guide explains how to deploy the QuakeMap application to Cloudflare.

## Architecture

- **API**: Deployed to Cloudflare Workers (serverless functions)
- **Web App**: Deployed to Cloudflare Pages (static hosting)

## Environment Configuration

The project supports two environments:
- **Development**: For testing and development purposes
- **Production**: For live deployment

## Environment Variables

Both environments require the `DATABASE_URL` environment variable to be configured in the wrangler.toml files.

### Setting Up Environment Variables

1. **Update Development Environment:**
   Edit `apps/api/wrangler.toml` and replace `postgresql://your-dev-db-connection-string` with your actual development database URL.

2. **Update Production Environment:**
   Edit `apps/api/wrangler.toml` and replace `postgresql://your-prod-db-connection-string` with your actual production database URL.

## Deployment Commands

### Deploy Both API and Web App

Deploy everything to production:
```bash
# Deploy both API and web app to production
pnpm deploy:all

# Deploy both to development
pnpm deploy:all:dev
```

### Deploy API Only

```bash
# Production
pnpm deploy:api:prod

# Development
pnpm deploy:api:dev
```

### Deploy Web App Only

```bash
# Production
pnpm deploy:web:prod

# Development  
pnpm deploy:web:dev
```

### Individual App Commands

From the API directory (`apps/api/`):
```bash
pnpm deploy        # Production
pnpm deploy:dev    # Development
pnpm deploy:prod   # Production
```

From the Web directory (`apps/web/`):
```bash
pnpm deploy        # Production
pnpm deploy:dev    # Development
pnpm deploy:prod   # Production
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
| CORS Origins | `http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173` | `https://quake-map-web-dev.pages.dev,https://quake-map-web.pages.dev` |
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
If you see `DATABASE_URL or NEON_DATABASE_URL environment variable is required`, make sure you've updated the DATABASE_URL in your `apps/api/wrangler.toml` file for the appropriate environment.

### Worker Name Mismatch
If you see a worker name mismatch warning, it's expected when deploying from CI/CD. The system will use the correct name based on your configuration.

## CI/CD Integration

The project includes GitHub Actions for automated deployment. To set up CI/CD:

1. **Set up GitHub Secrets:**
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Workers and Pages permissions
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

2. **Environment Variables:**
   - Set `DATABASE_URL` as a secret in your Cloudflare Workers dashboard for both environments

3. **Branch Strategy:**
   - `main` branch: Deploys to development environment
   - `production` branch: Deploys to production environment

4. **Workflow Features:**
   - Runs tests and linting before deployment
   - Builds both API and web app
   - Deploys API first, then web app
   - Supports both development and production environments

## Next Steps

After deployment, your applications will be available at:

**API Endpoints:**
- Development: `https://quake-map-dev.your-subdomain.workers.dev`
- Production: `https://quake-map.your-subdomain.workers.dev`

**Web App URLs:**
- Development: `https://quake-map-web-dev.pages.dev`
- Production: `https://quake-map-web.pages.dev`

## 🔧 Final Setup Steps

1. **Deploy your API first:**
   ```bash
   # Replace database URLs in apps/api/wrangler.toml
   pnpm deploy:api:prod
   ```

2. **Update web app API URL:**
   ```bash
   # Update the API_URL in apps/web/wrangler.toml
   # Replace with your actual Worker URL from step 1
   ```

3. **Deploy your web app:**
   ```bash
   pnpm deploy:web:prod
   ```

4. **Or deploy everything at once:**
   ```bash
   pnpm deploy:all
   ```

## 💰 **Cost Summary (FREE!)**
- **API**: Cloudflare Workers Free Tier (100k requests/day)
- **Web App**: Cloudflare Pages Free Tier (unlimited bandwidth)
- **Database**: Neon Free Tier (0.5GB storage)
- **Total monthly cost**: $0 for most applications!
