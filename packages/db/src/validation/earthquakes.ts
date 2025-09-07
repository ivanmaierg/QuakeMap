import { z } from 'zod';

// Base earthquake properties schema
export const EarthquakePropertiesSchema = z.object({
  mag: z.number().min(0).max(10),
  place: z.string().nullable(),
  time: z.number().positive(),
  updated: z.number().positive().nullable(),
  tz: z.number().nullable(),
  url: z.string().url().nullable(),
  detail: z.string().url().nullable(),
  felt: z.number().min(0).nullable(),
  cdi: z.number().min(0).max(12).nullable(),
  mmi: z.number().min(0).max(12).nullable(),
  alert: z.enum(['green', 'yellow', 'orange', 'red']).nullable(),
  status: z.enum(['automatic', 'reviewed', 'deleted']),
  tsunami: z.number().min(0).max(1),
  sig: z.number().min(0),
  net: z.string().min(1).max(10),
  code: z.string().min(1).max(20),
  ids: z.string().nullable(),
  sources: z.string().nullable(),
  types: z.string().nullable(),
  nst: z.number().min(0).nullable(),
  dmin: z.number().min(0).nullable(),
  rms: z.number().min(0).nullable(),
  gap: z.number().min(0).max(360).nullable(),
  magType: z.string().min(1).max(10),
  type: z.enum(['earthquake', 'explosion', 'quarry', 'other']),
});

// Geometry schema for GeoJSON
export const EarthquakeGeometrySchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([
    z.number().min(-180).max(180), // longitude
    z.number().min(-90).max(90),   // latitude
    z.number().min(-100).max(1000).optional() // depth (optional)
  ])
});

// Complete earthquake schema for database
export const EarthquakeSchema = z.object({
  id: z.number().int().positive().optional(),
  usgsId: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  magnitude: z.number().min(0).max(10),
  place: z.string().nullable(),
  time: z.date(),
  updated: z.date().nullable(),
  url: z.string().url().nullable(),
  detail: z.string().url().nullable(),
  felt: z.number().min(0).nullable(),
  cdi: z.number().min(0).max(12).nullable(),
  mmi: z.number().min(0).max(12).nullable(),
  alert: z.enum(['green', 'yellow', 'orange', 'red']).nullable(),
  status: z.enum(['automatic', 'reviewed', 'deleted']),
  tsunami: z.number().min(0).max(1),
  sig: z.number().min(0),
  net: z.string().min(1).max(10),
  code: z.string().min(1).max(20),
  ids: z.string().nullable(),
  sources: z.string().nullable(),
  types: z.string().nullable(),
  nst: z.number().min(0).nullable(),
  dmin: z.number().min(0).nullable(),
  rms: z.number().min(0).nullable(),
  gap: z.number().min(0).max(360).nullable(),
  magType: z.string().min(1).max(10),
  type: z.enum(['earthquake', 'explosion', 'quarry', 'other']),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  properties: EarthquakePropertiesSchema,
  geometry: EarthquakeGeometrySchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Query filters schema
export const EarthquakeFiltersSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minMagnitude: z.number().min(0).max(10).optional(),
  maxMagnitude: z.number().min(0).max(10).optional(),
  bbox: z.object({
    minLon: z.number().min(-180).max(180),
    minLat: z.number().min(-90).max(90),
    maxLon: z.number().min(-180).max(180),
    maxLat: z.number().min(-90).max(90),
  }).optional(),
  limit: z.number().int().min(1).max(10000).optional(),
});

// API query parameters schema (for URL parsing)
export const EarthquakeQueryParamsSchema = z.object({
  startDate: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
  minMagnitude: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0).max(10)).optional(),
  maxMagnitude: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0).max(10)).optional(),
  bbox: z.string().regex(/^-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*$/)
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      const [minLon, minLat, maxLon, maxLat] = val.split(',').map(Number);
      return { minLon, minLat, maxLon, maxLat };
    }),
  limit: z.string().transform((val) => parseInt(val)).pipe(z.number().int().min(1).max(10000)).optional(),
});

// GeoJSON Feature schema
export const EarthquakeFeatureSchema = z.object({
  type: z.literal('Feature'),
  id: z.string(),
  properties: z.object({
    id: z.number().int().positive(),
    usgsId: z.string(),
    title: z.string(),
    magnitude: z.number(),
    place: z.string().nullable(),
    time: z.number(),
    updated: z.number().nullable(),
    url: z.string().nullable(),
    detail: z.string().nullable(),
    felt: z.number().nullable(),
    cdi: z.number().nullable(),
    mmi: z.number().nullable(),
    alert: z.string().nullable(),
    status: z.string(),
    tsunami: z.number(),
    sig: z.number(),
    net: z.string(),
    code: z.string(),
    ids: z.string().nullable(),
    sources: z.string().nullable(),
    types: z.string().nullable(),
    nst: z.number().nullable(),
    dmin: z.number().nullable(),
    rms: z.number().nullable(),
    gap: z.number().nullable(),
    magType: z.string(),
    type: z.string(),
  }).and(EarthquakePropertiesSchema),
  geometry: EarthquakeGeometrySchema,
});

// GeoJSON FeatureCollection schema
export const EarthquakeFeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(EarthquakeFeatureSchema),
  metadata: z.object({
    total: z.number().int().min(0),
    limit: z.number().int().min(1),
    generated: z.string().datetime(),
  }).optional(),
});

// Statistics schema
export const EarthquakeStatsSchema = z.object({
  total: z.union([z.string(), z.number()]).transform((val) => typeof val === 'string' ? parseInt(val) : val).pipe(z.number().int().min(0)),
  maxMagnitude: z.number().min(0).max(10).nullable(),
  minMagnitude: z.number().min(0).max(10).nullable(),
  avgMagnitude: z.number().min(0).max(10).nullable(),
  latest: z.date().nullable(),
  earliest: z.date().nullable(),
});

// Type exports
export type EarthquakeData = z.infer<typeof EarthquakeSchema>;
export type EarthquakeProperties = z.infer<typeof EarthquakePropertiesSchema>;
export type EarthquakeGeometry = z.infer<typeof EarthquakeGeometrySchema>;
export type EarthquakeFilters = z.infer<typeof EarthquakeFiltersSchema>;
export type EarthquakeQueryParams = z.infer<typeof EarthquakeQueryParamsSchema>;
export type EarthquakeFeature = z.infer<typeof EarthquakeFeatureSchema>;
export type EarthquakeFeatureCollection = z.infer<typeof EarthquakeFeatureCollectionSchema>;
export type EarthquakeStats = z.infer<typeof EarthquakeStatsSchema>;
