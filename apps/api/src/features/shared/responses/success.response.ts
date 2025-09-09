import type { Context } from 'hono';

export const successResponse = <T>(c: Context, data: T, meta?: any) => {
  return c.json({
    data,
    meta,
    links: {
      self: c.req.url
    }
  });
};

export const collectionResponse = <T>(c: Context, data: T[], meta?: any) => {
  return c.json({
    data,
    meta: {
      total: data.length,
      ...meta
    },
    links: {
      self: c.req.url
    }
  });
};
