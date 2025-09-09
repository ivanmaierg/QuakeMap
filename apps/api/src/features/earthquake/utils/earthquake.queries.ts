import type { EarthquakeQueryParams, EarthquakeStats } from '../models/earthquake.type';

export const parseQueryParams = (queryParams: Record<string, string | undefined>): EarthquakeQueryParams => {
  return {
    startDate: queryParams.startDate ? new Date(queryParams.startDate) : undefined,
    endDate: queryParams.endDate ? new Date(queryParams.endDate) : undefined,
    minMagnitude: queryParams.minMagnitude ? parseFloat(queryParams.minMagnitude) : undefined,
    maxMagnitude: queryParams.maxMagnitude ? parseFloat(queryParams.maxMagnitude) : undefined,
    bbox: queryParams.bbox,
    limit: queryParams.limit ? parseInt(queryParams.limit) : 1000
  };
};

export const transformEarthquakeToFeature = (earthquake: any) => ({
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
    ...(earthquake.properties || {})
  },
  geometry: earthquake.geometry || {
    type: 'Point' as const,
    coordinates: [earthquake.longitude, earthquake.latitude]
  }
});

export const transformStatsToResponse = (stats: EarthquakeStats) => ({
  total_earthquakes: stats.total,
  last_updated: new Date().toISOString(),
  magnitude_distribution: {
    "0-1": 0,
    "1-2": 0,
    "2-3": 0,
    "3-4": 0,
    "4-5": 0,
    "5+": 0
  },
  recent_activity: {
    last_24h: 0,
    last_7d: 0,
    last_30d: 0
  }
});
