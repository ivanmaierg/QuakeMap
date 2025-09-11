import { createRoute, z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { EarthquakeQuerySchema, EarthquakeFeatureCollectionSchema } from '../models/earthquake.schema';
import { parseQueryParams, transformEarthquakeToFeature } from '../utils/earthquake.queries';
import { getEarthquakes as getEarthquakesQuery } from '../queries/earthquake.queries';
import { getDatabase } from '../../../middleware/db.middleware';
import { badRequestResponse, internalServerErrorResponse } from '../../shared/responses/error.response';
import type { Env } from '../../../types';

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
          schema: z.object({
            error: z.string(),
            details: z.string().optional(),
            code: z.string(),
            timestamp: z.string()
          })
        }
      },
      description: 'Invalid query parameters'
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            code: z.string(),
            timestamp: z.string()
          })
        }
      },
      description: 'Internal server error'
    }
  }
});

export const getEarthquakes = async (c: Context<Env>) => {
  try {
    const url = new URL(c.req.url);
    const searchParams = url.searchParams;

    // Convert URLSearchParams to object
    const queryParams: Record<string, string | undefined> = {};
    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }

    // Parse and validate query parameters
    const validatedParams = parseQueryParams(queryParams);

    // Get database connection
    const db = getDatabase(c);

    // Use Drizzle query
    const earthquakes = await getEarthquakesQuery(db, validatedParams);

    const features = earthquakes.map(transformEarthquakeToFeature);

    const response = {
      type: 'FeatureCollection' as const,
      features,
      metadata: {
        total: features.length,
        limit: validatedParams.limit || 1000,
        generated: new Date().toISOString()
      }
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching earthquakes:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return badRequestResponse(c, 'Invalid query parameters', error.message);
    }
    
    return internalServerErrorResponse(c, 'Failed to fetch earthquakes');
  }
};
