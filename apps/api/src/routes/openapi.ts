import { createRoute, z } from '@hono/zod-openapi';
import { 
  EarthquakeQuerySchema, 
  EarthquakeFeatureCollectionSchema, 
  EarthquakeStatsSchema, 
  HealthCheckSchema,
  ErrorResponseSchema 
} from '../schemas/earthquake';

// Health check route
export const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['System'],
  summary: 'Health check endpoint',
  description: 'Check the health status of the API service',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HealthCheckSchema
        }
      },
      description: 'Service is healthy'
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      },
      description: 'Service is unhealthy'
    }
  }
});

// Get earthquakes route
export const earthquakesRoute = createRoute({
  method: 'get',
  path: '/quakes',
  tags: ['Earthquakes'],
  summary: 'Get earthquakes with optional filtering',
  description: 'Retrieve earthquake data with optional filtering by date, magnitude, and location',
  request: {
    query: EarthquakeQuerySchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: EarthquakeFeatureCollectionSchema
        }
      },
      description: 'List of earthquakes in GeoJSON format'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      },
      description: 'Invalid query parameters'
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      },
      description: 'Internal server error'
    }
  }
});

// Get earthquake statistics route
export const earthquakeStatsRoute = createRoute({
  method: 'get',
  path: '/quakes/stats',
  tags: ['Earthquakes'],
  summary: 'Get earthquake statistics',
  description: 'Retrieve earthquake statistics and summary data',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: EarthquakeStatsSchema
        }
      },
      description: 'Earthquake statistics'
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      },
      description: 'Internal server error'
    }
  }
});

// Get single earthquake route
export const earthquakeByIdRoute = createRoute({
  method: 'get',
  path: '/quakes/{id}',
  tags: ['Earthquakes'],
  summary: 'Get earthquake by ID',
  description: 'Retrieve details for a specific earthquake by its internal ID',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).describe('Earthquake ID (numeric)')
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            type: z.literal('Feature'),
            id: z.string(),
            properties: z.any(),
            geometry: z.any()
          })
        }
      },
      description: 'Earthquake details in GeoJSON format'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      },
      description: 'Invalid earthquake ID'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      },
      description: 'Earthquake not found'
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      },
      description: 'Internal server error'
    }
  }
});
