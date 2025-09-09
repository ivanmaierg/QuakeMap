import { z } from 'zod';

// Earthquake query parameters schema
export const EarthquakeQuerySchema = z.object({
  startDate: z.string().optional().describe('Filter earthquakes after this date (ISO 8601)'),
  endDate: z.string().optional().describe('Filter earthquakes before this date (ISO 8601)'),
  minMagnitude: z.string().optional().describe('Minimum magnitude (0-10)'),
  maxMagnitude: z.string().optional().describe('Maximum magnitude (0-10)'),
  bbox: z.string().optional().describe('Bounding box "minLon,minLat,maxLon,maxLat"'),
  limit: z.string().optional().describe('Maximum number of results (1-1000)')
});

// Earthquake properties schema
export const EarthquakePropertiesSchema = z.object({
  id: z.number().describe('Internal earthquake ID'),
  usgsId: z.string().describe('USGS earthquake identifier'),
  title: z.string().describe('Earthquake title'),
  magnitude: z.number().describe('Earthquake magnitude'),
  place: z.string().nullable().describe('Location description'),
  time: z.number().describe('Timestamp in milliseconds'),
  updated: z.number().nullable().describe('Last updated timestamp in milliseconds'),
  url: z.string().nullable().describe('USGS event page URL'),
  detail: z.string().nullable().describe('Detailed information URL'),
  felt: z.number().nullable().describe('Number of people who felt the earthquake'),
  cdi: z.number().nullable().describe('Community Decimal Intensity'),
  mmi: z.number().nullable().describe('Modified Mercalli Intensity'),
  alert: z.string().nullable().describe('Alert level'),
  status: z.string().nullable().describe('Review status'),
  tsunami: z.number().nullable().describe('Tsunami flag'),
  sig: z.number().nullable().describe('Significance'),
  net: z.string().nullable().describe('Network identifier'),
  code: z.string().nullable().describe('Event code'),
  ids: z.string().nullable().describe('Comma-separated event IDs'),
  sources: z.string().nullable().describe('Comma-separated data sources'),
  types: z.string().nullable().describe('Comma-separated product types'),
  nst: z.number().nullable().describe('Number of seismic stations'),
  dmin: z.number().nullable().describe('Minimum distance to station'),
  rms: z.number().nullable().describe('Root mean square travel time residual'),
  gap: z.number().nullable().describe('Largest azimuthal gap'),
  magType: z.string().nullable().describe('Magnitude type'),
  type: z.string().nullable().describe('Event type')
});

// Earthquake geometry schema
export const EarthquakeGeometrySchema = z.object({
  type: z.literal('Point').describe('Geometry type'),
  coordinates: z.tuple([z.number(), z.number()]).describe('Longitude and latitude coordinates')
});

// Single earthquake feature schema
export const EarthquakeFeatureSchema = z.object({
  type: z.literal('Feature').describe('GeoJSON feature type'),
  id: z.string().describe('Feature identifier'),
  properties: EarthquakePropertiesSchema,
  geometry: EarthquakeGeometrySchema
});

// Earthquake feature collection schema
export const EarthquakeFeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection').describe('GeoJSON feature collection type'),
  features: z.array(EarthquakeFeatureSchema).describe('Array of earthquake features'),
  metadata: z.object({
    total: z.number().describe('Total number of earthquakes returned'),
    limit: z.number().describe('Maximum number of results requested'),
    generated: z.string().datetime().describe('Response generation timestamp')
  }).describe('Response metadata')
});

// Earthquake statistics schema
export const EarthquakeStatsSchema = z.object({
  total_earthquakes: z.number().describe('Total number of earthquakes in database'),
  last_updated: z.string().datetime().describe('Last database update timestamp'),
  magnitude_distribution: z.record(z.string(), z.number()).describe('Count of earthquakes by magnitude range'),
  recent_activity: z.object({
    last_24h: z.number().describe('Earthquakes in last 24 hours'),
    last_7d: z.number().describe('Earthquakes in last 7 days'),
    last_30d: z.number().describe('Earthquakes in last 30 days')
  }).describe('Recent earthquake activity')
});

// Health check schema
export const HealthCheckSchema = z.object({
  status: z.literal('healthy').describe('Service status'),
  timestamp: z.string().datetime().describe('Health check timestamp'),
  version: z.string().describe('API version'),
  database: z.string().describe('Database connection status'),
  uptime: z.number().describe('Service uptime in seconds')
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string().describe('Error message'),
  details: z.string().optional().describe('Additional error details')
});

// Type exports
export type EarthquakeQuery = z.infer<typeof EarthquakeQuerySchema>;
export type EarthquakeProperties = z.infer<typeof EarthquakePropertiesSchema>;
export type EarthquakeGeometry = z.infer<typeof EarthquakeGeometrySchema>;
export type EarthquakeFeature = z.infer<typeof EarthquakeFeatureSchema>;
export type EarthquakeFeatureCollection = z.infer<typeof EarthquakeFeatureCollectionSchema>;
export type EarthquakeStats = z.infer<typeof EarthquakeStatsSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
