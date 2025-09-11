import dotenv from 'dotenv';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../../src/index';
import { TestDatabase } from '../helpers/db';

// Load environment variables
dotenv.config({ path: '.test.vars' });

const MOCK_ENV = {
  ...process.env,
  DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
};

describe('API Documentation endpoints', () => {
  let db: TestDatabase = null;

  // Before all tests
  beforeAll(async () => {
    db = new TestDatabase();
    await db.setup();
  });

  // After all tests
  afterAll(async () => {
    await db.teardown();
  });

  describe('GET /', () => {
    it('should respond with 200 and return OpenAPI specification', async () => {
      const res = await app.request('/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res).not.toBeNull();
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toHaveProperty('openapi', '3.0.0');
      expect(data).toHaveProperty('info');
      expect(data).toHaveProperty('paths');
      expect(data.info).toHaveProperty('title', 'QuakeMap API');
      expect(data.info).toHaveProperty('version', '1.0.0');
      expect(data.info).toHaveProperty('description');
    });

    it('should include all expected paths in OpenAPI spec', async () => {
      const res = await app.request('/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      const data = await res.json();
      // Check if paths exist (they should be defined in the OpenAPI spec)
      expect(data.paths).toBeDefined();
      expect(typeof data.paths).toBe('object');
    });

    it('should include proper server information', async () => {
      const res = await app.request('/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      const data = await res.json();
      expect(data).toHaveProperty('servers');
      expect(Array.isArray(data.servers)).toBe(true);
      expect(data.servers.length).toBeGreaterThan(0);
    });
  });

  describe('GET /docs', () => {
    it('should respond with 200 and return Swagger UI HTML', async () => {
      const res = await app.request('/docs', {
        method: 'GET',
        headers: {
          'Content-Type': 'text/html',
          Accept: 'text/html',
        },
      }, MOCK_ENV);

      expect(res).not.toBeNull();
      expect(res.status).toBe(200);

      const html = await res.text();
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('swagger-ui');
      expect(html).toContain('QuakeMap API');
    });
  });
});
