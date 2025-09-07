import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { earthquakeRoutes } from './routes/earthquakes';
import { healthRoutes } from './routes/health';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());
app.use('*', prettyJSON());

// Routes
app.route('/api/health', healthRoutes);
app.route('/api/quakes', earthquakeRoutes);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'QuakeMap API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      earthquakes: '/api/quakes'
    }
  });
});

export default app;
