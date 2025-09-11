import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { createDbFromEnv, type Database } from '../client';
import { earthquakes } from '../schema';
import { EarthquakeFiltersSchema, type EarthquakeFilters, EarthquakeStatsSchema, type EarthquakeStats, EarthquakeSchema, type EarthquakeData } from '../validation/earthquakes';

export const getEarthquakes = async (filters: EarthquakeFilters = {}) => {
  const validatedFilters = EarthquakeFiltersSchema.parse(filters);
  
  const {
    startDate,
    endDate,
    minMagnitude = 0,
    maxMagnitude = 10,
    bbox,
    limit = 1000
  } = validatedFilters;

  const db = createDbFromEnv();
  let query = db.select().from(earthquakes);

  const conditions = [];

  if (startDate) {
    conditions.push(gte(earthquakes.time, startDate));
  }
  if (endDate) {
    conditions.push(lte(earthquakes.time, endDate));
  }

  if (minMagnitude !== undefined && minMagnitude > 0) {
    conditions.push(gte(earthquakes.magnitude, minMagnitude));
  }
  if (maxMagnitude !== undefined && maxMagnitude < 10) {
    conditions.push(lte(earthquakes.magnitude, maxMagnitude));
  }

  if (bbox) {
    conditions.push(
      and(
        gte(earthquakes.longitude, bbox.minLon),
        lte(earthquakes.longitude, bbox.maxLon),
        gte(earthquakes.latitude, bbox.minLat),
        lte(earthquakes.latitude, bbox.maxLat)
      )
    );
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  return await query
    .orderBy(desc(earthquakes.time))
    .limit(limit);
};

export const getEarthquakesWithDb = async (db: Database, filters: EarthquakeFilters = {}) => {
  const validatedFilters = EarthquakeFiltersSchema.parse(filters);
  
  const {
    startDate,
    endDate,
    minMagnitude = 0,
    maxMagnitude = 10,
    bbox,
    limit = 1000
  } = validatedFilters;

  let query = db.select().from(earthquakes);

  const conditions = [];

  if (startDate) {
    conditions.push(gte(earthquakes.time, startDate));
  }
  if (endDate) {
    conditions.push(lte(earthquakes.time, endDate));
  }

  if (minMagnitude !== undefined && minMagnitude > 0) {
    conditions.push(gte(earthquakes.magnitude, minMagnitude));
  }
  if (maxMagnitude !== undefined && maxMagnitude < 10) {
    conditions.push(lte(earthquakes.magnitude, maxMagnitude));
  }

  if (bbox) {
    conditions.push(
      and(
        gte(earthquakes.longitude, bbox.minLon),
        lte(earthquakes.longitude, bbox.maxLon),
        gte(earthquakes.latitude, bbox.minLat),
        lte(earthquakes.latitude, bbox.maxLat)
      )
    );
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  return await query
    .orderBy(desc(earthquakes.time))
    .limit(limit);
};

export const getEarthquakeById = async (id: number) => {
  const db = createDbFromEnv();
  return await db.select().from(earthquakes).where(eq(earthquakes.id, id)).limit(1);
};

export const getEarthquakeByIdWithDb = async (db: Database, id: number) => {
  return await db.select().from(earthquakes).where(eq(earthquakes.id, id)).limit(1);
};

export const getEarthquakeByUsgsId = async (usgsId: string) => {
  const db = createDbFromEnv();
  return await db.select().from(earthquakes).where(eq(earthquakes.usgsId, usgsId)).limit(1);
};

export const getEarthquakeByUsgsIdWithDb = async (db: Database, usgsId: string) => {
  return await db.select().from(earthquakes).where(eq(earthquakes.usgsId, usgsId)).limit(1);
};

export const getEarthquakeStats = async (): Promise<EarthquakeStats> => {
  const db = createDbFromEnv();
  
  const stats = await db
    .select({
      total: sql<number>`count(*)`,
      maxMagnitude: sql<number>`max(${earthquakes.magnitude})`,
      minMagnitude: sql<number>`min(${earthquakes.magnitude})`,
      avgMagnitude: sql<number>`avg(${earthquakes.magnitude})`,
      latest: sql<Date>`max(${earthquakes.time})`,
      earliest: sql<Date>`min(${earthquakes.time})`
    })
    .from(earthquakes);

  return EarthquakeStatsSchema.parse(stats[0]);
};

export const getEarthquakeStatsWithDb = async (db: Database): Promise<EarthquakeStats> => {
  const stats = await db
    .select({
      total: sql<number>`count(*)`,
      maxMagnitude: sql<number>`max(${earthquakes.magnitude})`,
      minMagnitude: sql<number>`min(${earthquakes.magnitude})`,
      avgMagnitude: sql<number>`avg(${earthquakes.magnitude})`,
      latest: sql<Date>`max(${earthquakes.time})`,
      earliest: sql<Date>`min(${earthquakes.time})`
    })
    .from(earthquakes);

  return EarthquakeStatsSchema.parse(stats[0]);
};

export const upsertEarthquake = async (earthquakeData: unknown): Promise<EarthquakeData> => {
  const validatedEarthquake = EarthquakeSchema.parse(earthquakeData);
  
  const db = createDbFromEnv();
  await db
    .insert(earthquakes)
    .values(validatedEarthquake)
    .onConflictDoUpdate({
      target: earthquakes.usgsId,
      set: {
        title: validatedEarthquake.title,
        magnitude: validatedEarthquake.magnitude,
        place: validatedEarthquake.place,
        time: validatedEarthquake.time,
        updated: validatedEarthquake.updated,
        url: validatedEarthquake.url,
        detail: validatedEarthquake.detail,
        felt: validatedEarthquake.felt,
        cdi: validatedEarthquake.cdi,
        mmi: validatedEarthquake.mmi,
        alert: validatedEarthquake.alert,
        status: validatedEarthquake.status,
        tsunami: validatedEarthquake.tsunami,
        sig: validatedEarthquake.sig,
        net: validatedEarthquake.net,
        code: validatedEarthquake.code,
        ids: validatedEarthquake.ids,
        sources: validatedEarthquake.sources,
        types: validatedEarthquake.types,
        nst: validatedEarthquake.nst,
        dmin: validatedEarthquake.dmin,
        rms: validatedEarthquake.rms,
        gap: validatedEarthquake.gap,
        magType: validatedEarthquake.magType,
        type: validatedEarthquake.type,
        longitude: validatedEarthquake.longitude,
        latitude: validatedEarthquake.latitude,
        properties: validatedEarthquake.properties,
        geometry: validatedEarthquake.geometry,
        updatedAt: new Date()
      }
    });

  return validatedEarthquake;
};

export const upsertEarthquakeWithDb = async (db: Database, earthquakeData: unknown): Promise<EarthquakeData> => {
  const validatedEarthquake = EarthquakeSchema.parse(earthquakeData);
  
  await db
    .insert(earthquakes)
    .values(validatedEarthquake)
    .onConflictDoUpdate({
      target: earthquakes.usgsId,
      set: {
        title: validatedEarthquake.title,
        magnitude: validatedEarthquake.magnitude,
        place: validatedEarthquake.place,
        time: validatedEarthquake.time,
        updated: validatedEarthquake.updated,
        url: validatedEarthquake.url,
        detail: validatedEarthquake.detail,
        felt: validatedEarthquake.felt,
        cdi: validatedEarthquake.cdi,
        mmi: validatedEarthquake.mmi,
        alert: validatedEarthquake.alert,
        status: validatedEarthquake.status,
        tsunami: validatedEarthquake.tsunami,
        sig: validatedEarthquake.sig,
        net: validatedEarthquake.net,
        code: validatedEarthquake.code,
        ids: validatedEarthquake.ids,
        sources: validatedEarthquake.sources,
        types: validatedEarthquake.types,
        nst: validatedEarthquake.nst,
        dmin: validatedEarthquake.dmin,
        rms: validatedEarthquake.rms,
        gap: validatedEarthquake.gap,
        magType: validatedEarthquake.magType,
        type: validatedEarthquake.type,
        longitude: validatedEarthquake.longitude,
        latitude: validatedEarthquake.latitude,
        properties: validatedEarthquake.properties,
        geometry: validatedEarthquake.geometry,
        updatedAt: new Date()
      }
    });

  return validatedEarthquake;
};