import type { OpenAPIHono } from '@hono/zod-openapi';
import type { AppEmitter } from '../../events';
import { getEarthquakes } from './endpoints/earthquakes.get';
import { getEarthquakeStats } from './endpoints/earthquake-stats.get';
import { getEarthquakeById } from './endpoints/earthquake.get';
import { dataIngestionListener, statsUpdatedListener, earthquakeCreatedListener } from './events/listeners';

export const earthquakeBootstrap = (app: OpenAPIHono, emitter: AppEmitter) => {
  // Register event listeners
  emitter.on('data:ingested', dataIngestionListener);
  emitter.on('stats:updated', statsUpdatedListener);
  emitter.on('earthquake:created', earthquakeCreatedListener);

  // Register routes
  app.get('/quakes', getEarthquakes);
  app.get('/quakes/stats', getEarthquakeStats);
  app.get('/quakes/:id', getEarthquakeById);

  console.log('✅ Earthquake feature bootstrapped');
};
