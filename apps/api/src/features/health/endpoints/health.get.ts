import { createRoute, z } from '@hono/zod-openapi';
import type { Context } from 'hono';
import type { Env } from '../../../types';

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
          schema: z.object({
            status: z.literal('healthy'),
            timestamp: z.string().datetime(),
            version: z.string(),
            database: z.string(),
            uptime: z.number()
          })
        }
      },
      description: 'Service is healthy'
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
      description: 'Service is unhealthy'
    }
  }
});

export const getHealth = (c: Context<Env>) => {
  return c.json({
    status: 'healthy' as const,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'connected',
    uptime: process.uptime ? Math.floor(process.uptime()) : 0
  });
};
