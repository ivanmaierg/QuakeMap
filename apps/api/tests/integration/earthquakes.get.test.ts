import dotenv from 'dotenv';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../../src/index';
import { TestDatabase } from '../helpers/db';

// Load environment variables
dotenv.config({ path: '.test.vars' });

const MOCK_ENV = {
  ...process.env,
  DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
};

describe('Earthquakes GET endpoints', () => {
  let db: TestDatabase = null;
  let entities = null;

  // Before all tests
  beforeAll(async () => {
    db = new TestDatabase();
    await db.setup();
  });

  // After all tests
  afterAll(async () => {
    await db.teardown();
  });

  // Before each test
  beforeEach(async () => {
    // Clear the database and populate with test data for each test
    await db.clear();
    entities = await db.seed();
  });

  describe('GET /earthquakes', () => {
    it('should respond with 200 and return earthquake data', async () => {
      const res = await app.request('/earthquakes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res).not.toBeNull();
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toHaveProperty('type', 'FeatureCollection');
      expect(data).toHaveProperty('features');
      expect(data).toHaveProperty('metadata');
      expect(Array.isArray(data.features)).toBe(true);
      expect(data.features.length).toBe(3); // We seeded 3 earthquakes
      expect(data.metadata.total).toBe(3);
    });

    it('should filter by minimum magnitude', async () => {
      const res = await app.request('/earthquakes?minMagnitude=4.0', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.features.length).toBe(2); // Only earthquakes with magnitude >= 4.0
      expect(data.features.every((f: any) => f.properties.magnitude >= 4.0)).toBe(true);
    });

    it('should filter by maximum magnitude', async () => {
      const res = await app.request('/earthquakes?maxMagnitude=4.0', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.features.length).toBe(2); // Only earthquakes with magnitude <= 4.0
      expect(data.features.every((f: any) => f.properties.magnitude <= 4.0)).toBe(true);
    });

    it('should filter by magnitude range', async () => {
      const res = await app.request('/earthquakes?minMagnitude=4.0&maxMagnitude=5.0', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.features.length).toBe(1); // Only one earthquake in this range
      expect(data.features[0].properties.magnitude).toBe(4.5);
    });

    it('should limit results', async () => {
      const res = await app.request('/earthquakes?limit=2', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.features.length).toBe(2);
      expect(data.metadata.limit).toBe(2);
    });

    it('should filter by date range', async () => {
      const startDate = '2024-01-15T00:00:00Z';
      const endDate = '2024-01-16T23:59:59Z';
      
      const res = await app.request(`/earthquakes?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.features.length).toBe(2); // Two earthquakes in this date range
    });

    it('should handle invalid query parameters gracefully', async () => {
      const res = await app.request('/earthquakes?minMagnitude=invalid', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      // Should still return 200 but with no results or handle gracefully
      expect(res.status).toBe(200);
    });
  });

  describe('GET /earthquakes/stats', () => {
    it('should respond with 200 and return statistics', async () => {
      const res = await app.request('/earthquakes/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res).not.toBeNull();
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toHaveProperty('total_earthquakes');
      expect(data).toHaveProperty('last_updated');
      expect(data).toHaveProperty('magnitude_distribution');
      expect(data).toHaveProperty('recent_activity');
      expect(data.total_earthquakes).toBe(3);
    });
  });

  describe('GET /earthquakes/{id}', () => {
    it('should respond with 200 and return specific earthquake', async () => {
      const earthquakeId = entities.earthquakes[0].id;
      const res = await app.request(`/earthquakes/${earthquakeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res).not.toBeNull();
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toHaveProperty('type', 'Feature');
      expect(data).toHaveProperty('id', earthquakeId.toString());
      expect(data).toHaveProperty('properties');
      expect(data).toHaveProperty('geometry');
    });

    it('should respond with 404 for non-existent earthquake', async () => {
      const res = await app.request('/earthquakes/99999', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(404);
    });

    it('should respond with 400 for invalid earthquake ID', async () => {
      const res = await app.request('/earthquakes/invalid', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(400);
    });
  });

  describe('Legacy endpoints', () => {
    it('should respond with 200 for /api/quakes', async () => {
      const res = await app.request('/api/quakes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('type', 'FeatureCollection');
    });
  });
});
