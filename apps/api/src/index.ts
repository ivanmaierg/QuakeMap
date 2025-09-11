import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
// Note: Event emitter will be implemented when needed
// import { createEventEmitter } from 'hono-event-emitter';

import { earthquakeRoutes } from './routes/earthquakes';
import { healthRoutes } from './routes/health';
import { bootstrapFeatures } from './features/bootstrap';
import type { Env } from './types';
// import type { AppEmitter } from './events';

const app = new OpenAPIHono<Env>();

// Create event emitter (simplified for now)
const emitter = {
  on: (event: string, _handler: Function) => {
    console.log(`📡 Event listener registered: ${event}`);
  },
  emit: (event: string, data: any) => {
    console.log(`📡 Event emitted: ${event}`, data);
  }
} as any;

// Middleware
app.use('*', cors({
  origin: (origin, c) => {
    const corsOrigins = c.env?.CORS_ORIGINS || 'http://localhost:5173';
    const allowedOrigins = corsOrigins.split(',').map(o => o.trim());
    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
  },
  crossOriginEmbedderPolicy: false, // Disable for API
}));
app.use('*', logger());
app.use('*', prettyJSON());

// OpenAPI Documentation
app.doc('/', (c) => ({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'QuakeMap API',
    description: 'Real-time earthquake data API with filtering and statistics',
  },
  servers: [
    {
      url: 'http://localhost:8787',
      description: 'Development environment',
    },
    {
      url: new URL(c.req.url).origin,
      description: 'Production environment',
    },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check endpoint',
        description: 'Check the health status of the API service',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    timestamp: { type: 'string', format: 'date-time' },
                    version: { type: 'string', example: '1.0.0' },
                    database: { type: 'string', example: 'connected' },
                    uptime: { type: 'number', example: 3600 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/quakes': {
      get: {
        tags: ['Earthquakes'],
        summary: 'Get earthquakes with optional filtering',
        description: 'Retrieve earthquake data with optional filtering by date, magnitude, and location',
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            description: 'Filter earthquakes after this date (ISO 8601)',
            schema: { type: 'string', format: 'date-time' }
          },
          {
            name: 'endDate',
            in: 'query',
            description: 'Filter earthquakes before this date (ISO 8601)',
            schema: { type: 'string', format: 'date-time' }
          },
          {
            name: 'minMagnitude',
            in: 'query',
            description: 'Minimum magnitude (0-10)',
            schema: { type: 'number', minimum: 0, maximum: 10 }
          },
          {
            name: 'maxMagnitude',
            in: 'query',
            description: 'Maximum magnitude (0-10)',
            schema: { type: 'number', minimum: 0, maximum: 10 }
          },
          {
            name: 'bbox',
            in: 'query',
            description: 'Bounding box "minLon,minLat,maxLon,maxLat"',
            schema: { type: 'string' }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum number of results (1-1000)',
            schema: { type: 'number', minimum: 1, maximum: 1000, default: 1000 }
          }
        ],
        responses: {
          '200': {
            description: 'List of earthquakes in GeoJSON format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', example: 'FeatureCollection' },
                    features: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          type: { type: 'string', example: 'Feature' },
                          id: { type: 'string' },
                          properties: { type: 'object' },
                          geometry: { type: 'object' }
                        }
                      }
                    },
                    metadata: {
                      type: 'object',
                      properties: {
                        total: { type: 'number' },
                        limit: { type: 'number' },
                        generated: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid query parameters',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/quakes/stats': {
      get: {
        tags: ['Earthquakes'],
        summary: 'Get earthquake statistics',
        description: 'Retrieve earthquake statistics and summary data',
        responses: {
          '200': {
            description: 'Earthquake statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total_earthquakes: { type: 'number' },
                    last_updated: { type: 'string', format: 'date-time' },
                    magnitude_distribution: {
                      type: 'object',
                      additionalProperties: { type: 'number' }
                    },
                    recent_activity: {
                      type: 'object',
                      properties: {
                        last_24h: { type: 'number' },
                        last_7d: { type: 'number' },
                        last_30d: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/quakes/{id}': {
      get: {
        tags: ['Earthquakes'],
        summary: 'Get earthquake by ID',
        description: 'Retrieve details for a specific earthquake by its internal ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Earthquake ID (numeric)',
            schema: { type: 'string', pattern: '^\\d+$' }
          }
        ],
        responses: {
          '200': {
            description: 'Earthquake details in GeoJSON format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', example: 'Feature' },
                    id: { type: 'string' },
                    properties: { type: 'object' },
                    geometry: { type: 'object' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid earthquake ID',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Earthquake not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}));

// Swagger UI
app.get('/docs', swaggerUI({ url: '/' }));

// Bootstrap features
bootstrapFeatures(app as any, emitter);

// Legacy routes (for backward compatibility)
app.route('/api/health', healthRoutes);
app.route('/api/quakes', earthquakeRoutes);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'QuakeMap API',
    version: '1.0.0',
    documentation: '/docs',
    openapi: '/',
    endpoints: {
      health: '/health',
      earthquakes: '/quakes',
      stats: '/quakes/stats'
    }
  });
});

export default app;
