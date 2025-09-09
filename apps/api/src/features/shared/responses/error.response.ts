import type { Context } from 'hono';

export const badRequestResponse = (c: Context, message: string, details?: string) => {
  return c.json({
    error: message,
    details,
    code: 'BAD_REQUEST',
    timestamp: new Date().toISOString()
  }, 400);
};

export const notFoundResponse = (c: Context, message: string = 'Resource not found') => {
  return c.json({
    error: message,
    code: 'NOT_FOUND',
    timestamp: new Date().toISOString()
  }, 404);
};

export const internalServerErrorResponse = (c: Context, message: string = 'Internal server error') => {
  return c.json({
    error: message,
    code: 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString()
  }, 500);
};

export const unauthorizedResponse = (c: Context, message: string = 'Unauthorized') => {
  return c.json({
    error: message,
    code: 'UNAUTHORIZED',
    timestamp: new Date().toISOString()
  }, 401);
};
