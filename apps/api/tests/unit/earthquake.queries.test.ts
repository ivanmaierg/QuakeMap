import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { TestDatabase } from '../helpers/db';
import { getEarthquakes, getEarthquakeById, getEarthquakeStats } from '../../src/features/earthquake/queries/earthquake.queries';

describe('Earthquake Queries', () => {
  let db: TestDatabase = null;
  let entities = null;

  beforeAll(async () => {
    db = new TestDatabase();
    await db.setup();
  });

  afterAll(async () => {
    await db.teardown();
  });

  beforeEach(async () => {
    await db.clear();
    entities = await db.seed();
  });

  describe('getEarthquakes', () => {
    it('should return all earthquakes when no filters applied', async () => {
      const earthquakes = await getEarthquakes(db.db, {});
      
      expect(earthquakes).toHaveLength(3);
      expect(earthquakes[0]).toHaveProperty('usgsId');
      expect(earthquakes[0]).toHaveProperty('magnitude');
      expect(earthquakes[0]).toHaveProperty('place');
    });

    it('should filter by minimum magnitude', async () => {
      const earthquakes = await getEarthquakes(db.db, { minMagnitude: 4.0 });
      
      expect(earthquakes).toHaveLength(2);
      expect(earthquakes.every(eq => eq.magnitude >= 4.0)).toBe(true);
    });

    it('should filter by maximum magnitude', async () => {
      const earthquakes = await getEarthquakes(db.db, { maxMagnitude: 4.0 });
      
      expect(earthquakes).toHaveLength(2);
      expect(earthquakes.every(eq => eq.magnitude <= 4.0)).toBe(true);
    });

    it('should filter by magnitude range', async () => {
      const earthquakes = await getEarthquakes(db.db, { 
        minMagnitude: 4.0, 
        maxMagnitude: 5.0 
      });
      
      expect(earthquakes).toHaveLength(1);
      expect(earthquakes[0].magnitude).toBe(4.5);
    });

    it('should filter by date range', async () => {
      const startDate = new Date('2024-01-15T00:00:00Z');
      const endDate = new Date('2024-01-16T23:59:59Z');
      
      const earthquakes = await getEarthquakes(db.db, { 
        startDate, 
        endDate 
      });
      
      expect(earthquakes).toHaveLength(2);
    });

    it('should limit results', async () => {
      const earthquakes = await getEarthquakes(db.db, { limit: 2 });
      
      expect(earthquakes).toHaveLength(2);
    });

    it('should filter by bounding box', async () => {
      // Bounding box around San Francisco area
      const bbox = '-123.0,37.0,-122.0,38.0';
      
      const earthquakes = await getEarthquakes(db.db, { bbox });
      
      expect(earthquakes).toHaveLength(1); // Only one earthquake in SF area
      expect(earthquakes[0].place).toBe('Test Location 1');
    });

    it('should combine multiple filters', async () => {
      const startDate = new Date('2024-01-15T00:00:00Z');
      const earthquakes = await getEarthquakes(db.db, { 
        minMagnitude: 4.0,
        startDate,
        limit: 1
      });
      
      expect(earthquakes).toHaveLength(1);
      expect(earthquakes[0].magnitude).toBeGreaterThanOrEqual(4.0);
    });
  });

  describe('getEarthquakeById', () => {
    it('should return earthquake by ID', async () => {
      const earthquakeId = entities.earthquakes[0].id;
      const earthquake = await getEarthquakeById(db.db, earthquakeId);
      
      expect(earthquake).not.toBeNull();
      expect(earthquake.id).toBe(earthquakeId);
      expect(earthquake.usgsId).toBe('test-1');
    });

    it('should return null for non-existent ID', async () => {
      const earthquake = await getEarthquakeById(db.db, 99999);
      
      expect(earthquake).toBeNull();
    });
  });

  describe('getEarthquakeStats', () => {
    it('should return earthquake statistics', async () => {
      const stats = await getEarthquakeStats(db.db);
      
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('maxMagnitude');
      expect(stats).toHaveProperty('minMagnitude');
      expect(stats).toHaveProperty('avgMagnitude');
      expect(stats).toHaveProperty('latest');
      expect(stats).toHaveProperty('earliest');
      
      expect(stats.total).toBe(3);
      expect(stats.maxMagnitude).toBe(6.2);
      expect(stats.minMagnitude).toBe(3.1);
      expect(stats.avgMagnitude).toBeCloseTo(4.6, 1);
    });
  });
});
