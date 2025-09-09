# 🔧 API Reference & Database Schema

## REST API Endpoints

### Base URL
```
Production: https://quake-map-api.your-domain.workers.dev
Development: http://localhost:8787
```

### API Documentation
- **OpenAPI Specification**: `GET /` - Complete API specification in OpenAPI 3.0 format
- **Swagger UI**: `GET /docs` - Interactive API documentation and testing interface

### Authentication
Currently no authentication required. Future versions may include API keys for rate limiting.

## Core Endpoints

### Health Check

#### GET /health
Check the health status of the API service.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "database": "connected",
  "uptime": 3600
}
```

### Earthquake Data

#### GET /earthquakes
Retrieve earthquake data with optional filtering (new feature-based endpoint).

**Query Parameters:**
- `startDate` (optional): ISO date string - Filter earthquakes after this date
- `endDate` (optional): ISO date string - Filter earthquakes before this date
- `minMagnitude` (optional): number - Minimum magnitude (0-10)
- `maxMagnitude` (optional): number - Maximum magnitude (0-10)
- `bbox` (optional): string - Bounding box "minLon,minLat,maxLon,maxLat"
- `limit` (optional): number - Maximum number of results (1-1000, default: 1000)

#### GET /earthquakes/stats
Get earthquake statistics and summary data.

**Response:**
```json
{
  "total_earthquakes": 1500,
  "last_updated": "2024-01-15T10:30:00.000Z",
  "magnitude_distribution": {
    "0-1": 100,
    "1-2": 200,
    "2-3": 300,
    "3-4": 400,
    "4-5": 300,
    "5+": 200
  },
  "recent_activity": {
    "last_24h": 15,
    "last_7d": 85,
    "last_30d": 350
  }
}
```

#### GET /earthquakes/{id}
Get earthquake details by ID.

**Path Parameters:**
- `id` (required): string - Earthquake ID (numeric)

### Legacy Endpoints (Backward Compatibility)

#### GET /api/quakes
Retrieve earthquake data with optional filtering.

**Query Parameters:**
- `startDate` (optional): ISO date string - Filter earthquakes after this date
- `endDate` (optional): ISO date string - Filter earthquakes before this date
- `minMagnitude` (optional): number - Minimum magnitude (default: 0)
- `maxMagnitude` (optional): number - Maximum magnitude (default: 10)
- `bbox` (optional): string - Bounding box "minLon,minLat,maxLon,maxLat"
- `limit` (optional): number - Maximum number of results (default: 1000)

**Example Request:**
```bash
GET /api/quakes?minMagnitude=4.0&startDate=2024-01-01&limit=100
```

**Response Format:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.4194, 37.7749]
      },
      "properties": {
        "id": 1,
        "usgs_id": "nc73840991",
        "place": "5km NW of The Geysers, CA",
        "magnitude": 4.2,
        "time": "2024-01-15T10:30:00.000Z",
        "url": "https://earthquake.usgs.gov/earthquakes/eventpage/nc73840991",
        "depth_km": 2.1
      }
    }
  ],
  "metadata": {
    "total": 1,
    "limit": 100,
    "generated": "2024-01-15T10:35:00.000Z"
  }
}
```

### GET /api/quakes/stats
Get earthquake statistics and summary data.

**Response:**
```json
{
  "total_earthquakes": 1250,
  "last_updated": "2024-01-15T10:30:00.000Z",
  "magnitude_distribution": {
    "0-1": 45,
    "1-2": 320,
    "2-3": 580,
    "3-4": 250,
    "4-5": 45,
    "5+": 10
  },
  "recent_activity": {
    "last_24h": 12,
    "last_7d": 67,
    "last_30d": 234
  }
}
```

### GET /api/quakes/{id}
Get details for a specific earthquake.

**Response:**
```json
{
  "id": 1,
  "usgs_id": "nc73840991",
  "place": "5km NW of The Geysers, CA",
  "magnitude": 4.2,
  "time": "2024-01-15T10:30:00.000Z",
  "url": "https://earthquake.usgs.gov/earthquakes/eventpage/nc73840991",
  "longitude": -122.4194,
  "latitude": 37.7749,
  "depth_km": 2.1,
  "created_at": "2024-01-15T10:31:00.000Z",
  "updated_at": "2024-01-15T10:31:00.000Z"
}
```

### GET /api/health
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:35:00.000Z",
  "version": "1.0.0",
  "database": "connected",
  "uptime": 3600
}
```

## Database Schema

### Quakes Table
```sql
CREATE TABLE quakes (
  id SERIAL PRIMARY KEY,
  usgs_id VARCHAR(50) UNIQUE NOT NULL,
  place TEXT NOT NULL,
  magnitude DECIMAL(3,1) NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  url TEXT,
  longitude DECIMAL(10,7) NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  depth_km DECIMAL(8,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes for Performance
```sql
-- Time-based queries
CREATE INDEX idx_quakes_time ON quakes(time DESC);

-- Magnitude filtering
CREATE INDEX idx_quakes_magnitude ON quakes(magnitude DESC);

-- Spatial queries (requires PostGIS extension)
CREATE INDEX idx_quakes_location ON quakes USING GIST(ST_Point(longitude, latitude));

-- Composite index for common queries
CREATE INDEX idx_quakes_time_mag ON quakes(time DESC, magnitude DESC);
```

### Drizzle Schema Definition
```typescript
import { pgTable, serial, varchar, text, decimal, timestamp, index } from 'drizzle-orm/pg-core';

export const quakes = pgTable('quakes', {
  id: serial('id').primaryKey(),
  usgsId: varchar('usgs_id', { length: 50 }).unique().notNull(),
  place: text('place').notNull(),
  magnitude: decimal('magnitude', { precision: 3, scale: 1 }).notNull(),
  time: timestamp('time', { withTimezone: true }).notNull(),
  url: text('url'),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  depthKm: decimal('depth_km', { precision: 8, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  timeIdx: index('idx_quakes_time').on(table.time.desc()),
  magnitudeIdx: index('idx_quakes_magnitude').on(table.magnitude.desc()),
  timeMagnitudeIdx: index('idx_quakes_time_mag').on(table.time.desc(), table.magnitude.desc()),
}));
```

## Data Ingestion

### USGS API Integration
The system fetches data from the USGS Earthquake API:
- **Endpoint**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`
- **Frequency**: Every hour via CRON job
- **Data Format**: GeoJSON FeatureCollection
- **Rate Limiting**: Respects USGS API limits

### Data Processing Pipeline
1. **Fetch**: Retrieve latest earthquake data from USGS
2. **Validate**: Check data integrity and required fields
3. **Transform**: Convert GeoJSON to database schema format
4. **Upsert**: Insert new records or update existing ones
5. **Log**: Record processing statistics and errors

## Error Handling

### HTTP Status Codes
- `200 OK`: Successful request
- `400 Bad Request`: Invalid query parameters
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid magnitude range provided",
    "details": {
      "parameter": "minMagnitude",
      "value": -1,
      "expected": "number between 0 and 10"
    }
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

## Rate Limiting

### Current Limits
- **Free Tier**: 1000 requests per hour
- **Per IP**: 100 requests per minute
- **Burst**: 10 requests per second

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## CORS Configuration

```typescript
const cors = {
  origin: ['https://quake-map.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization'],
  credentials: false
};
```
