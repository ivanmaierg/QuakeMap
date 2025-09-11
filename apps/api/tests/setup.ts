// Test setup file
import dotenv from 'dotenv';
import { vi } from 'vitest';

// Load test environment variables
dotenv.config({ path: '.test.vars' });

// Set default test environment variables if not present
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/testdb';
process.env.ENVIRONMENT = process.env.ENVIRONMENT || 'test';
process.env.PROJECT_NAME = process.env.PROJECT_NAME || 'QuakeMap API Test';
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:3000';
process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:8787';

// Mock database connection for tests
global.mockDatabase = {
  query: {
    earthquakes: vi.fn()
  },
  execute: vi.fn(),
  transaction: vi.fn(),
};

// Add the earthquakes property to the query object
global.mockDatabase.query.earthquakes = vi.fn();

// Mock the database client
vi.mock('@quake-map/db', () => ({
  db: global.mockDatabase,
  getEarthquakes: vi.fn(),
  getEarthquakeById: vi.fn(),
  getEarthquakeStats: vi.fn(),
  getEarthquakesWithDb: vi.fn(),
  getEarthquakeStatsWithDb: vi.fn(),
  earthquakes: global.mockDatabase,
  EarthquakeQueryParamsSchema: {
    parse: vi.fn((data) => data)
  },
  createDatabase: vi.fn(() => global.mockDatabase),
  getDatabase: vi.fn(() => global.mockDatabase),
}));

// Mock the createDatabase function specifically
vi.mock('../../src/middleware/db.middleware', () => ({
  createDatabase: vi.fn(() => global.mockDatabase),
  getDatabase: vi.fn(() => global.mockDatabase),
}));
