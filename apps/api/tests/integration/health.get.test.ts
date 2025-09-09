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

describe('Health GET endpoint', () => {
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

  it('should respond with 200 and health status', async () => {
    const res = await app.request('/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }, MOCK_ENV);

    expect(res).not.toBeNull();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('status', 'healthy');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('version', '1.0.0');
    expect(data).toHaveProperty('database', 'connected');
    expect(data).toHaveProperty('uptime');
    expect(typeof data.uptime).toBe('number');
  });

  it('should respond with 200 for legacy /api/health endpoint', async () => {
    const res = await app.request('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }, MOCK_ENV);

    expect(res).not.toBeNull();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('status', 'healthy');
  });
});
