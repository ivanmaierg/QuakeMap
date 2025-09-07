import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or NEON_DATABASE_URL environment variable is required');
}

const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10
});

async function setup() {
  try {
    console.log('🔧 Setting up database...');
    
    // Create the earthquakes table
    await sql`
      CREATE TABLE IF NOT EXISTS "earthquakes" (
        "id" serial PRIMARY KEY NOT NULL,
        "usgs_id" text NOT NULL,
        "title" text NOT NULL,
        "magnitude" real NOT NULL,
        "place" text,
        "time" timestamp with time zone NOT NULL,
        "updated" timestamp with time zone,
        "url" text,
        "detail" text,
        "felt" real,
        "cdi" real,
        "mmi" real,
        "alert" text,
        "status" text,
        "tsunami" real,
        "sig" real,
        "net" text,
        "code" text,
        "ids" text,
        "sources" text,
        "types" text,
        "nst" real,
        "dmin" real,
        "rms" real,
        "gap" real,
        "mag_type" text,
        "type" text,
        "longitude" real NOT NULL,
        "latitude" real NOT NULL,
        "properties" jsonb,
        "geometry" jsonb,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "earthquakes_usgs_id_unique" UNIQUE("usgs_id")
      );
    `;
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS "usgs_id_idx" ON "earthquakes" ("usgs_id");`;
    await sql`CREATE INDEX IF NOT EXISTS "magnitude_idx" ON "earthquakes" ("magnitude");`;
    await sql`CREATE INDEX IF NOT EXISTS "time_idx" ON "earthquakes" ("time");`;
    await sql`CREATE INDEX IF NOT EXISTS "location_idx" ON "earthquakes" ("longitude","latitude");`;
    await sql`CREATE INDEX IF NOT EXISTS "magnitude_time_idx" ON "earthquakes" ("magnitude","time");`;
    
    console.log('✅ Database table created successfully');
    
    // Insert sample data
    const sampleEarthquakes = [
      {
        usgs_id: 'nc73840991',
        title: 'M 4.2 - 5km NW of The Geysers, CA',
        magnitude: 4.2,
        place: '5km NW of The Geysers, CA',
        time: new Date('2024-01-15T10:30:00.000Z'),
        updated: new Date('2024-01-15T10:35:00.000Z'),
        url: 'https://earthquake.usgs.gov/earthquakes/eventpage/nc73840991',
        detail: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/nc73840991.geojson',
        felt: 15,
        cdi: 3.4,
        mmi: 3.4,
        alert: null,
        status: 'reviewed',
        tsunami: 0,
        sig: 271,
        net: 'nc',
        code: '73840991',
        ids: ',nc73840991,',
        sources: ',nc,',
        types: ',origin,phase-data,',
        nst: 25,
        dmin: 0.1,
        rms: 0.05,
        gap: 45,
        mag_type: 'ml',
        type: 'earthquake',
        longitude: -122.7749,
        latitude: 38.7874,
        properties: {
          mag: 4.2,
          place: '5km NW of The Geysers, CA',
          time: 1705312200000,
          updated: 1705312500000,
          tz: null,
          url: 'https://earthquake.usgs.gov/earthquakes/eventpage/nc73840991',
          detail: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/nc73840991.geojson',
          felt: 15,
          cdi: 3.4,
          mmi: 3.4,
          alert: null,
          status: 'reviewed',
          tsunami: 0,
          sig: 271,
          net: 'nc',
          code: '73840991',
          ids: ',nc73840991,',
          sources: ',nc,',
          types: ',origin,phase-data,',
          nst: 25,
          dmin: 0.1,
          rms: 0.05,
          gap: 45,
          mag_type: 'ml',
          type: 'earthquake'
        },
        geometry: {
          type: 'Point',
          coordinates: [-122.7749, 38.7874, 2.1]
        }
      },
      {
        usgs_id: 'us7000m8kz',
        title: 'M 5.1 - 15km SSE of Ridgecrest, CA',
        magnitude: 5.1,
        place: '15km SSE of Ridgecrest, CA',
        time: new Date('2024-01-14T08:15:00.000Z'),
        updated: new Date('2024-01-14T08:20:00.000Z'),
        url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m8kz',
        detail: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000m8kz.geojson',
        felt: 45,
        cdi: 4.2,
        mmi: 4.2,
        alert: 'green',
        status: 'reviewed',
        tsunami: 0,
        sig: 400,
        net: 'us',
        code: '7000m8kz',
        ids: ',us7000m8kz,',
        sources: ',us,',
        types: ',origin,phase-data,',
        nst: 35,
        dmin: 0.2,
        rms: 0.08,
        gap: 30,
        mag_type: 'mw',
        type: 'earthquake',
        longitude: -117.6543,
        latitude: 35.5234,
        properties: {
          mag: 5.1,
          place: '15km SSE of Ridgecrest, CA',
          time: 1705306500000,
          updated: 1705306800000,
          tz: null,
          url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m8kz',
          detail: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000m8kz.geojson',
          felt: 45,
          cdi: 4.2,
          mmi: 4.2,
          alert: 'green',
          status: 'reviewed',
          tsunami: 0,
          sig: 400,
          net: 'us',
          code: '7000m8kz',
          ids: ',us7000m8kz,',
          sources: ',us,',
          types: ',origin,phase-data,',
          nst: 35,
          dmin: 0.2,
          rms: 0.08,
          gap: 30,
          mag_type: 'mw',
          type: 'earthquake'
        },
        geometry: {
          type: 'Point',
          coordinates: [-117.6543, 35.5234, 5.2]
        }
      }
    ];
    
    for (const earthquake of sampleEarthquakes) {
      await sql`
        INSERT INTO earthquakes (
          usgs_id, title, magnitude, place, time, updated, url, detail,
          felt, cdi, mmi, alert, status, tsunami, sig, net, code, ids,
          sources, types, nst, dmin, rms, gap, mag_type, type, longitude,
          latitude, properties, geometry
        ) VALUES (
          ${earthquake.usgs_id}, ${earthquake.title}, ${earthquake.magnitude},
          ${earthquake.place}, ${earthquake.time}, ${earthquake.updated},
          ${earthquake.url}, ${earthquake.detail}, ${earthquake.felt},
          ${earthquake.cdi}, ${earthquake.mmi}, ${earthquake.alert},
          ${earthquake.status}, ${earthquake.tsunami}, ${earthquake.sig},
          ${earthquake.net}, ${earthquake.code}, ${earthquake.ids},
          ${earthquake.sources}, ${earthquake.types}, ${earthquake.nst},
          ${earthquake.dmin}, ${earthquake.rms}, ${earthquake.gap},
          ${earthquake.mag_type}, ${earthquake.type}, ${earthquake.longitude},
          ${earthquake.latitude}, ${JSON.stringify(earthquake.properties)},
          ${JSON.stringify(earthquake.geometry)}
        ) ON CONFLICT (usgs_id) DO NOTHING;
      `;
    }
    
    console.log(`✅ Successfully seeded ${sampleEarthquakes.length} earthquakes`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

setup();
