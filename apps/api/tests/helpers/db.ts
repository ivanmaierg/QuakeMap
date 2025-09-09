import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { earthquakes } from '@quake-map/db';
import type { Database } from '../../src/middleware/db.middleware';

export class TestDatabase {
  private client: postgres.Sql | null = null;
  public db: Database | null = null;

  async setup(): Promise<void> {
    // Use a test database URL or in-memory database
    const testDatabaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/testdb';
    
    try {
      this.client = postgres(testDatabaseUrl, {
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
        ssl: 'require'
      });

      this.db = drizzle(this.client, {
        schema: { earthquakes },
        logger: false // Disable logging in tests
      });
    } catch (error) {
      console.warn('Database connection failed, using mock database for tests');
      // For testing without a real database, we'll create a mock
      this.db = null;
    }
  }

  async teardown(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
    this.db = null;
  }

  async clear(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Clear all earthquake data
    await this.db.delete(earthquakes);
  }

  async seed(): Promise<any> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Insert test earthquake data
    const testEarthquakes = [
      {
        usgsId: 'test-1',
        title: 'Test Earthquake 1',
        magnitude: 4.5,
        place: 'Test Location 1',
        time: new Date('2024-01-15T10:30:00Z'),
        updated: new Date('2024-01-15T10:35:00Z'),
        url: 'https://example.com/test1',
        detail: 'https://example.com/test1/detail',
        felt: 10,
        cdi: 3.5,
        mmi: 4.0,
        alert: 'green',
        status: 'reviewed',
        tsunami: 0,
        sig: 320,
        net: 'us',
        code: '12345678',
        ids: ',test-1,',
        sources: ',us,',
        types: ',origin,phase-data,',
        nst: 25,
        dmin: 0.5,
        rms: 0.8,
        gap: 45,
        magType: 'ml',
        type: 'earthquake',
        longitude: -122.4194,
        latitude: 37.7749,
        properties: {
          mag: 4.5,
          place: 'Test Location 1',
          time: 1705312200000,
          updated: 1705312500000,
          tz: -480,
          url: 'https://example.com/test1',
          detail: 'https://example.com/test1/detail',
          felt: 10,
          cdi: 3.5,
          mmi: 4.0,
          alert: 'green',
          status: 'reviewed',
          tsunami: 0,
          sig: 320,
          net: 'us',
          code: '12345678',
          ids: ',test-1,',
          sources: ',us,',
          types: ',origin,phase-data,',
          nst: 25,
          dmin: 0.5,
          rms: 0.8,
          gap: 45,
          magType: 'ml',
          type: 'earthquake'
        },
        geometry: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749, 5.0]
        }
      },
      {
        usgsId: 'test-2',
        title: 'Test Earthquake 2',
        magnitude: 6.2,
        place: 'Test Location 2',
        time: new Date('2024-01-16T14:20:00Z'),
        updated: new Date('2024-01-16T14:25:00Z'),
        url: 'https://example.com/test2',
        detail: 'https://example.com/test2/detail',
        felt: 50,
        cdi: 5.5,
        mmi: 6.0,
        alert: 'yellow',
        status: 'reviewed',
        tsunami: 0,
        sig: 600,
        net: 'us',
        code: '87654321',
        ids: ',test-2,',
        sources: ',us,',
        types: ',origin,phase-data,',
        nst: 50,
        dmin: 0.2,
        rms: 0.5,
        gap: 20,
        magType: 'mw',
        type: 'earthquake',
        longitude: -118.2437,
        latitude: 34.0522,
        properties: {
          mag: 6.2,
          place: 'Test Location 2',
          time: 1705401600000,
          updated: 1705401900000,
          tz: -480,
          url: 'https://example.com/test2',
          detail: 'https://example.com/test2/detail',
          felt: 50,
          cdi: 5.5,
          mmi: 6.0,
          alert: 'yellow',
          status: 'reviewed',
          tsunami: 0,
          sig: 600,
          net: 'us',
          code: '87654321',
          ids: ',test-2,',
          sources: ',us,',
          types: ',origin,phase-data,',
          nst: 50,
          dmin: 0.2,
          rms: 0.5,
          gap: 20,
          magType: 'mw',
          type: 'earthquake'
        },
        geometry: {
          type: 'Point',
          coordinates: [-118.2437, 34.0522, 10.0]
        }
      },
      {
        usgsId: 'test-3',
        title: 'Test Earthquake 3',
        magnitude: 3.1,
        place: 'Test Location 3',
        time: new Date('2024-01-17T08:15:00Z'),
        updated: new Date('2024-01-17T08:20:00Z'),
        url: 'https://example.com/test3',
        detail: 'https://example.com/test3/detail',
        felt: 5,
        cdi: 2.0,
        mmi: 3.0,
        alert: 'green',
        status: 'reviewed',
        tsunami: 0,
        sig: 150,
        net: 'us',
        code: '11223344',
        ids: ',test-3,',
        sources: ',us,',
        types: ',origin,phase-data,',
        nst: 15,
        dmin: 1.0,
        rms: 1.2,
        gap: 60,
        magType: 'ml',
        type: 'earthquake',
        longitude: -74.0060,
        latitude: 40.7128,
        properties: {
          mag: 3.1,
          place: 'Test Location 3',
          time: 1705481700000,
          updated: 1705482000000,
          tz: -300,
          url: 'https://example.com/test3',
          detail: 'https://example.com/test3/detail',
          felt: 5,
          cdi: 2.0,
          mmi: 3.0,
          alert: 'green',
          status: 'reviewed',
          tsunami: 0,
          sig: 150,
          net: 'us',
          code: '11223344',
          ids: ',test-3,',
          sources: ',us,',
          types: ',origin,phase-data,',
          nst: 15,
          dmin: 1.0,
          rms: 1.2,
          gap: 60,
          magType: 'ml',
          type: 'earthquake'
        },
        geometry: {
          type: 'Point',
          coordinates: [-74.0060, 40.7128, 2.0]
        }
      }
    ];

    const insertedEarthquakes = await this.db.insert(earthquakes).values(testEarthquakes).returning();

    return {
      earthquakes: insertedEarthquakes
    };
  }
}
