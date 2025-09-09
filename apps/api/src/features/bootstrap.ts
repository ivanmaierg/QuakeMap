import type { OpenAPIHono } from '@hono/zod-openapi';
import type { AppEmitter } from '../events';
import { earthquakeBootstrap } from './earthquake/bootstrap';
import { healthBootstrap } from './health/bootstrap';

export const bootstrapFeatures = (app: OpenAPIHono, emitter: AppEmitter) => {
  console.log('🚀 Bootstrapping features...');
  
  // Bootstrap features in order
  healthBootstrap(app);
  earthquakeBootstrap(app, emitter);
  
  console.log('✅ All features bootstrapped successfully');
};
