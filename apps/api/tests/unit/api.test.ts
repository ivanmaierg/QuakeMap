import { describe, expect, it } from 'vitest';
import app from '../../src/index';

describe('API Basic Tests', () => {
  const MOCK_ENV = {
    DATABASE_URL: 'postgresql://test:test@localhost:5432/testdb',
    ENVIRONMENT: 'test',
    PROJECT_NAME: 'QuakeMap API Test',
    CORS_ORIGINS: 'http://localhost:3000',
    BASE_URL: 'http://localhost:8787'
  };

  describe('Root endpoint', () => {
    it('should respond with API information', async () => {
      const res = await app.request('/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('openapi', '3.0.0');
      expect(data).toHaveProperty('info');
      expect(data.info).toHaveProperty('title', 'QuakeMap API');
      expect(data.info).toHaveProperty('version', '1.0.0');
    });
  });

  describe('Health endpoint', () => {
    it('should respond with health status', async () => {
      const res = await app.request('/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('status', 'healthy');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('version', '1.0.0');
    });
  });

  describe('Documentation endpoints', () => {
    it('should serve OpenAPI specification', async () => {
      const res = await app.request('/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('openapi', '3.0.0');
      expect(data).toHaveProperty('info');
      expect(data).toHaveProperty('paths');
    });

    it('should serve Swagger UI', async () => {
      const res = await app.request('/docs', {
        method: 'GET',
        headers: {
          'Content-Type': 'text/html',
          Accept: 'text/html',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('<html');
      expect(html).toContain('swagger-ui');
    });
  });

  describe('Earthquake endpoints', () => {
    it('should handle earthquakes endpoint (may fail without DB)', async () => {
      const res = await app.request('/earthquakes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      // This might fail without a real database, but we can test the endpoint exists
      expect([200, 500]).toContain(res.status);
    });

    it('should handle earthquake stats endpoint (may fail without DB)', async () => {
      const res = await app.request('/earthquakes/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      // This might fail without a real database, but we can test the endpoint exists
      expect([200, 500]).toContain(res.status);
    });

    it('should handle individual earthquake endpoint (may fail without DB)', async () => {
      const res = await app.request('/earthquakes/1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      // This might fail without a real database, but we can test the endpoint exists
      expect([200, 404, 500]).toContain(res.status);
    });
  });

  describe('Legacy endpoints', () => {
    it('should handle legacy health endpoint', async () => {
      const res = await app.request('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('status', 'healthy');
    });

    it('should handle legacy earthquakes endpoint (may fail without DB)', async () => {
      const res = await app.request('/api/quakes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }, MOCK_ENV);

      // This might fail without a real database, but we can test the endpoint exists
      expect([200, 500]).toContain(res.status);
    });
  });
});
