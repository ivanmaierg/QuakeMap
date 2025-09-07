import { db } from './client';
import { earthquakes } from './schema';

const sampleEarthquakes = [
  {
    usgsId: 'nc73840991',
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
    magType: 'ml',
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
      magType: 'ml',
      type: 'earthquake'
    },
    geometry: {
      type: 'Point',
      coordinates: [-122.7749, 38.7874, 2.1]
    }
  },
  {
    usgsId: 'us7000m8kz',
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
    magType: 'mw',
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
      magType: 'mw',
      type: 'earthquake'
    },
    geometry: {
      type: 'Point',
      coordinates: [-117.6543, 35.5234, 5.2]
    }
  },
  {
    usgsId: 'ak0245abc123',
    title: 'M 3.8 - 25km E of Anchorage, AK',
    magnitude: 3.8,
    place: '25km E of Anchorage, AK',
    time: new Date('2024-01-13T14:22:00.000Z'),
    updated: new Date('2024-01-13T14:25:00.000Z'),
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/ak0245abc123',
    detail: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/ak0245abc123.geojson',
    felt: 8,
    cdi: 2.1,
    mmi: 2.1,
    alert: null,
    status: 'reviewed',
    tsunami: 0,
    sig: 227,
    net: 'ak',
    code: '0245abc123',
    ids: ',ak0245abc123,',
    sources: ',ak,',
    types: ',origin,phase-data,',
    nst: 20,
    dmin: 0.3,
    rms: 0.06,
    gap: 55,
    magType: 'ml',
    type: 'earthquake',
    longitude: -149.5234,
    latitude: 61.1876,
    properties: {
      mag: 3.8,
      place: '25km E of Anchorage, AK',
      time: 1705152120000,
      updated: 1705152300000,
      tz: null,
      url: 'https://earthquake.usgs.gov/earthquakes/eventpage/ak0245abc123',
      detail: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/ak0245abc123.geojson',
      felt: 8,
      cdi: 2.1,
      mmi: 2.1,
      alert: null,
      status: 'reviewed',
      tsunami: 0,
      sig: 227,
      net: 'ak',
      code: '0245abc123',
      ids: ',ak0245abc123,',
      sources: ',ak,',
      types: ',origin,phase-data,',
      nst: 20,
      dmin: 0.3,
      rms: 0.06,
      gap: 55,
      magType: 'ml',
      type: 'earthquake'
    },
    geometry: {
      type: 'Point',
      coordinates: [-149.5234, 61.1876, 12.5]
    }
  }
];

async function seed() {
  try {
    console.log('🌱 Seeding database with sample earthquake data...');
    
    for (const earthquake of sampleEarthquakes) {
      await db.insert(earthquakes).values(earthquake).onConflictDoNothing();
    }
    
    console.log(`✅ Successfully seeded ${sampleEarthquakes.length} earthquakes`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
