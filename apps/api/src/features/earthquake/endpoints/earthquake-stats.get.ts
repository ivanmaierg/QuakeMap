import { createRoute, z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { EarthquakeStatsSchema } from '../models/earthquake.schema';
import { transformStatsToResponse } from '../utils/earthquake.queries';
import { getEarthquakeStats as getEarthquakeStatsQuery } from '../queries/earthquake.queries';
import { getDatabase } from '../../../middleware/db.middleware';
import { successResponse } from '../../shared/responses/success.response';
import { internalServerErrorResponse } from '../../shared/responses/error.response';
import type { Env } from '../../../types';

export const earthquakeStatsRoute = createRoute({
  method: 'get',
  path: '/earthquakes/stats',
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

export const getEarthquakeStats = async (c: Context<Env>) => {
  try {
    // Get database connection
    const db = getDatabase(c);

    // Use Drizzle query
    const stats = await getEarthquakeStatsQuery(db);
    
    const transformedStats = transformStatsToResponse(stats);
    
    return successResponse(c, transformedStats);
  } catch (error) {
    console.error('Error fetching earthquake stats:', error);
    return internalServerErrorResponse(c, 'Failed to fetch earthquake statistics');
  }
};
