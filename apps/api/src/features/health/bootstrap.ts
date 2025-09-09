import type { OpenAPIHono } from '@hono/zod-openapi';
import { getHealth } from './endpoints/health.get';

export const healthBootstrap = (app: OpenAPIHono) => {
  // Register routes
  app.get('/health', getHealth);

  console.log('✅ Health feature bootstrapped');
};
