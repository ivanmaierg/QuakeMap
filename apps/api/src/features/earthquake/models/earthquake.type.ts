export interface Earthquake {
  id: number;
  usgsId: string;
  title: string;
  magnitude: number;
  place: string | null;
  time: Date;
  updated: Date | null;
  url: string | null;
  detail: string | null;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string | null;
  tsunami: number | null;
  sig: number | null;
  net: string | null;
  code: string | null;
  ids: string | null;
  sources: string | null;
  types: string | null;
  nst: number | null;
  dmin: number | null;
  rms: number | null;
  gap: number | null;
  magType: string | null;
  type: string | null;
  longitude: number;
  latitude: number;
  properties: Record<string, any> | null;
  geometry: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EarthquakeQueryParams {
  startDate?: Date;
  endDate?: Date;
  minMagnitude?: number;
  maxMagnitude?: number;
  bbox?: string;
  limit?: number;
}

export interface EarthquakeStats {
  total: number;
  maxMagnitude: number | null;
  minMagnitude: number | null;
  avgMagnitude: number | null;
  latest: Date | null;
  earliest: Date | null;
}
