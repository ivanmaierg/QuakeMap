# 🧪 API Testing Documentation

## Overview

This directory contains comprehensive tests for the QuakeMap API, including unit tests, integration tests, and test utilities. The testing infrastructure is built with Vitest and follows the patterns from the API template.

## Test Structure

```
tests/
├── helpers/
│   └── db.ts              # Database test utilities
├── integration/
│   ├── health.get.test.ts # Health endpoint tests
│   ├── earthquakes.get.test.ts # Earthquake endpoint tests
│   └── docs.test.ts       # Documentation endpoint tests
├── unit/
│   ├── api.test.ts        # Basic API functionality tests
│   ├── db.middleware.test.ts # Database middleware tests
│   └── earthquake.queries.test.ts # Database query tests
├── setup.ts               # Test environment setup
└── README.md              # This file
```

## Running Tests

### All Tests
```bash
pnpm test
```

### Specific Test Files
```bash
pnpm test tests/unit/api.test.ts
pnpm test tests/integration/health.get.test.ts
```

### Watch Mode
```bash
pnpm test:watch
```

### Coverage Report
```bash
pnpm test:coverage
```

## Test Categories

### 1. Unit Tests (`tests/unit/`)

#### API Basic Tests (`api.test.ts`)
- **Root endpoint**: Tests OpenAPI specification serving
- **Health endpoint**: Tests health check functionality
- **Documentation endpoints**: Tests Swagger UI and OpenAPI spec
- **Earthquake endpoints**: Tests earthquake data endpoints (with DB connection handling)
- **Legacy endpoints**: Tests backward compatibility

#### Database Middleware Tests (`db.middleware.test.ts`)
- **createDatabase**: Tests database instance creation
- **getDatabase**: Tests database retrieval from context
- **Error handling**: Tests missing DATABASE_URL scenarios

#### Earthquake Query Tests (`earthquake.queries.test.ts`)
- **getEarthquakes**: Tests earthquake filtering and querying
- **getEarthquakeById**: Tests individual earthquake retrieval
- **getEarthquakeStats**: Tests statistics generation
- **Filter combinations**: Tests multiple filter combinations

### 2. Integration Tests (`tests/integration/`)

#### Health Endpoint Tests (`health.get.test.ts`)
- Tests health status response
- Tests database connection status
- Tests legacy endpoint compatibility

#### Earthquake Endpoint Tests (`earthquakes.get.test.ts`)
- Tests earthquake data retrieval with various filters
- Tests magnitude filtering (min/max/range)
- Tests date range filtering
- Tests bounding box filtering
- Tests result limiting
- Tests individual earthquake retrieval
- Tests statistics endpoint
- Tests error handling for invalid parameters

#### Documentation Tests (`docs.test.ts`)
- Tests OpenAPI specification serving
- Tests Swagger UI HTML generation
- Tests API path completeness

## Test Utilities

### Database Helper (`helpers/db.ts`)

The `TestDatabase` class provides:
- **Database setup/teardown**: Manages test database connections
- **Data seeding**: Populates test database with sample earthquake data
- **Data clearing**: Cleans database between tests
- **Connection handling**: Handles database connection errors gracefully

#### Sample Test Data
The test database is seeded with 3 sample earthquakes:
- **Test Earthquake 1**: Magnitude 4.5, San Francisco area
- **Test Earthquake 2**: Magnitude 6.2, Los Angeles area  
- **Test Earthquake 3**: Magnitude 3.1, New York area

## Test Configuration

### Environment Setup (`setup.ts`)
- Loads test environment variables from `.test.vars`
- Sets default values for required environment variables
- Configures test database URL

### Vitest Configuration (`vitest.config.ts`)
- Configures test file patterns
- Sets up test environment
- Configures module resolution
- Includes setup file for environment configuration

## Test Environment

### Environment Variables
Tests use the following environment variables:
- `DATABASE_URL`: Test database connection string
- `ENVIRONMENT`: Set to 'test'
- `PROJECT_NAME`: Test project name
- `CORS_ORIGINS`: Test CORS origins
- `BASE_URL`: Test base URL

### Database Requirements
- Tests can run with or without a real database
- Database connection failures are handled gracefully
- Mock database responses are used when real database is unavailable

## Test Patterns

### API Testing Pattern
```typescript
const res = await app.request('/endpoint', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}, MOCK_ENV);

expect(res.status).toBe(200);
const data = await res.json();
expect(data).toHaveProperty('expectedProperty');
```

### Database Testing Pattern
```typescript
let db: TestDatabase = null;

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
```

## Coverage Goals

- **API Endpoints**: 100% endpoint coverage
- **Database Queries**: 100% query function coverage
- **Error Handling**: 100% error path coverage
- **Edge Cases**: Critical edge case coverage

## Continuous Integration

Tests are designed to run in CI environments:
- No external dependencies required
- Graceful handling of missing database
- Fast execution time
- Clear error reporting

## Future Enhancements

- **E2E Tests**: End-to-end testing with real database
- **Performance Tests**: Load testing for API endpoints
- **Security Tests**: Authentication and authorization testing
- **Mock Services**: External service mocking for isolated testing
