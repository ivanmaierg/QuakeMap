import { createRoute, z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { transformEarthquakeToFeature } from '../utils/earthquake.queries';
import { getEarthquakeById as getEarthquakeByIdQuery } from '../queries/earthquake.queries';
import { getDatabase } from '../../../middleware/db.middleware';
import { successResponse } from '../../shared/responses/success.response';
import { badRequestResponse, notFoundResponse, internalServerErrorResponse } from '../../shared/responses/error.response';
import type { Env } from '../../../types';

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
          schema: z.object({
            error: z.string(),
            code: z.string(),
            timestamp: z.string()
          })
        }
      },
      description: 'Invalid earthquake ID'
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            code: z.string(),
            timestamp: z.string()
          })
        }
      },
      description: 'Earthquake not found'
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

export const getEarthquakeById = async (c: Context<Env>) => {
  try {
    const idParam = c.req.param('id');
    const id = parseInt(idParam);
    
    if (isNaN(id) || id <= 0) {
      return badRequestResponse(c, 'Invalid earthquake ID');
    }

    // Get database connection
    const db = getDatabase(c);

    // Use Drizzle query
    const earthquake = await getEarthquakeByIdQuery(db, id);

    if (!earthquake) {
      return notFoundResponse(c, 'Earthquake not found');
    }

    const feature = transformEarthquakeToFeature(earthquake);
    return successResponse(c, feature);
  } catch (error) {
    console.error('Error fetching earthquake:', error);
    return internalServerErrorResponse(c, 'Failed to fetch earthquake');
  }
};
