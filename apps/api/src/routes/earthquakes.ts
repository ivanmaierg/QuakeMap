import { Hono } from 'hono';
import { getEarthquakes, getEarthquakeStats } from '@quake-map/db';
import { EarthquakeQueryParamsSchema, EarthquakeFeatureCollectionSchema, type EarthquakeQueryParams } from '@quake-map/db';

export const earthquakeRoutes = new Hono();

// Get earthquakes with optional filters
earthquakeRoutes.get('/', async (c) => {
  try {
    const url = new URL(c.req.url);
    const searchParams = url.searchParams;

    // Convert URLSearchParams to object for Zod validation
    const queryParams: Record<string, string | undefined> = {};
    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }

    // Validate query parameters with Zod
    const validatedParams = EarthquakeQueryParamsSchema.parse(queryParams);

    const earthquakes = await getEarthquakes(validatedParams);

    const response = {
      type: 'FeatureCollection' as const,
      features: earthquakes.map(quake => ({
        type: 'Feature' as const,
        id: quake.usgsId,
        properties: {
          id: quake.id,
          usgsId: quake.usgsId,
          title: quake.title,
          magnitude: quake.magnitude,
          place: quake.place,
          time: quake.time.getTime(),
          updated: quake.updated?.getTime() || null,
          url: quake.url,
          detail: quake.detail,
          felt: quake.felt,
          cdi: quake.cdi,
          mmi: quake.mmi,
          alert: quake.alert,
          status: quake.status,
          tsunami: quake.tsunami,
          sig: quake.sig,
          net: quake.net,
          code: quake.code,
          ids: quake.ids,
          sources: quake.sources,
          types: quake.types,
          nst: quake.nst,
          dmin: quake.dmin,
          rms: quake.rms,
          gap: quake.gap,
          magType: quake.magType,
          type: quake.type,
          ...quake.properties
        },
        geometry: quake.geometry || {
          type: 'Point' as const,
          coordinates: [quake.longitude, quake.latitude]
        }
      })),
      metadata: {
        total: earthquakes.length,
        limit: validatedParams.limit || 1000,
        generated: new Date().toISOString()
      }
    };

    // Validate response with Zod
    const validatedResponse = EarthquakeFeatureCollectionSchema.parse(response);
    return c.json(validatedResponse);
  } catch (error) {
    console.error('Error fetching earthquakes:', error);
    
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({ 
        error: 'Invalid query parameters', 
        details: error.message 
      }, 400);
    }
    
    return c.json({ error: 'Failed to fetch earthquakes' }, 500);
  }
});

// Get earthquake statistics
earthquakeRoutes.get('/stats', async (c) => {
  try {
    const stats = await getEarthquakeStats();
    return c.json(stats);
  } catch (error) {
    console.error('Error fetching earthquake stats:', error);
    return c.json({ error: 'Failed to fetch earthquake statistics' }, 500);
  }
});

// Get individual earthquake by ID
earthquakeRoutes.get('/:id', async (c) => {
  try {
    const idParam = c.req.param('id');
    const id = parseInt(idParam);
    
    if (isNaN(id) || id <= 0) {
      return c.json({ error: 'Invalid earthquake ID' }, 400);
    }

    const earthquakes = await getEarthquakes({ limit: 1000 });
    const earthquake = earthquakes.find(q => q.id === id);

    if (!earthquake) {
      return c.json({ error: 'Earthquake not found' }, 404);
    }

    const response = {
      type: 'Feature' as const,
      id: earthquake.usgsId,
      properties: {
        id: earthquake.id,
        usgsId: earthquake.usgsId,
        title: earthquake.title,
        magnitude: earthquake.magnitude,
        place: earthquake.place,
        time: earthquake.time.getTime(),
        updated: earthquake.updated?.getTime() || null,
        url: earthquake.url,
        detail: earthquake.detail,
        felt: earthquake.felt,
        cdi: earthquake.cdi,
        mmi: earthquake.mmi,
        alert: earthquake.alert,
        status: earthquake.status,
        tsunami: earthquake.tsunami,
        sig: earthquake.sig,
        net: earthquake.net,
        code: earthquake.code,
        ids: earthquake.ids,
        sources: earthquake.sources,
        types: earthquake.types,
        nst: earthquake.nst,
        dmin: earthquake.dmin,
        rms: earthquake.rms,
        gap: earthquake.gap,
        magType: earthquake.magType,
        type: earthquake.type,
        ...earthquake.properties
      },
      geometry: earthquake.geometry || {
        type: 'Point' as const,
        coordinates: [earthquake.longitude, earthquake.latitude]
      }
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching earthquake:', error);
    return c.json({ error: 'Failed to fetch earthquake' }, 500);
  }
});
