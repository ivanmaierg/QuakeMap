import { eq, and, gte, lte, desc, count, sql } from 'drizzle-orm';
import { earthquakes } from '@quake-map/db';
import type { Database } from '../../../middleware/db.middleware';
import type { EarthquakeQueryParams } from '../models/earthquake.type';

export const getEarthquakes = async (db: Database, params: EarthquakeQueryParams = {}) => {
  const {
    startDate,
    endDate,
    minMagnitude,
    maxMagnitude,
    bbox,
    limit = 1000
  } = params;

  let query = db.select().from(earthquakes);

  // Apply filters
  const conditions = [];

  if (startDate) {
    conditions.push(gte(earthquakes.time, startDate));
  }

  if (endDate) {
    conditions.push(lte(earthquakes.time, endDate));
  }

  if (minMagnitude !== undefined) {
    conditions.push(gte(earthquakes.magnitude, minMagnitude));
  }

  if (maxMagnitude !== undefined) {
    conditions.push(lte(earthquakes.magnitude, maxMagnitude));
  }

  if (bbox) {
    // Parse bounding box "minLon,minLat,maxLon,maxLat"
    const [minLon, minLat, maxLon, maxLat] = bbox.split(',').map(Number);
    if (minLon && minLat && maxLon && maxLat) {
      conditions.push(
        and(
          gte(earthquakes.longitude, minLon),
          gte(earthquakes.latitude, minLat),
          lte(earthquakes.longitude, maxLon),
          lte(earthquakes.latitude, maxLat)
        )
      );
    }
  }

  if (conditions.length > 0) {
    return query
      .where(and(...conditions))
      .orderBy(desc(earthquakes.time))
      .limit(limit);
  }

  // Order by time descending and limit
  return query
    .orderBy(desc(earthquakes.time))
    .limit(limit);
};

export const getEarthquakeById = async (db: Database, id: number) => {
  const result = await db
    .select()
    .from(earthquakes)
    .where(eq(earthquakes.id, id))
    .limit(1);

  return result[0] || null;
};

export const getEarthquakeStats = async (db: Database) => {
  const [stats] = await db
    .select({
      total: count(),
      maxMagnitude: sql<number>`max(${earthquakes.magnitude})`,
      minMagnitude: sql<number>`min(${earthquakes.magnitude})`,
      avgMagnitude: sql<number>`avg(${earthquakes.magnitude})`,
      latest: sql<Date>`max(${earthquakes.time})`,
      earliest: sql<Date>`min(${earthquakes.time})`
    })
    .from(earthquakes);

  return stats;
};

export const getRecentEarthquakes = async (db: Database, hours: number = 24) => {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return db
    .select()
    .from(earthquakes)
    .where(gte(earthquakes.time, cutoffTime))
    .orderBy(desc(earthquakes.time));
};

export const getEarthquakesByMagnitudeRange = async (
  db: Database, 
  minMag: number, 
  maxMag: number
) => {
  return db
    .select()
    .from(earthquakes)
    .where(
      and(
        gte(earthquakes.magnitude, minMag),
        lte(earthquakes.magnitude, maxMag)
      )
    )
    .orderBy(desc(earthquakes.magnitude));
};
