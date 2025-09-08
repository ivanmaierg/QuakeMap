import { writable, derived } from 'svelte/store';
import { fetchEarthquakes, fetchEarthquakeStats } from '../api';
import type { EarthquakeFeatureCollection, EarthquakeStats } from '@quake-map/db';

export interface EarthquakeFilters {
  minMagnitude?: number;
  maxMagnitude?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

// Main stores
export const earthquakes = writable<EarthquakeFeatureCollection | null>(null);
export const earthquakeStats = writable<EarthquakeStats | null>(null);
export const loading = writable<boolean>(false);
export const error = writable<string | null>(null);
export const filters = writable<EarthquakeFilters>({});

// Derived stores
export const earthquakeCount = derived(earthquakes, $earthquakes => 
  $earthquakes?.features?.length || 0
);

export const maxMagnitude = derived(earthquakeStats, $stats => 
  $stats?.maxMagnitude || 0
);

export const minMagnitude = derived(earthquakeStats, $stats => 
  $stats?.minMagnitude || 0
);

export const avgMagnitude = derived(earthquakeStats, $stats => 
  $stats?.avgMagnitude || 0
);

export const lastUpdate = derived(earthquakeStats, $stats => 
  $stats?.latest ? new Date($stats.latest) : null
);

// Actions
export const loadEarthquakes = async (newFilters: EarthquakeFilters = {}) => {
  loading.set(true);
  error.set(null);
  
  try {
    const [earthquakesResult, statsResult] = await Promise.all([
      fetchEarthquakes(newFilters),
      fetchEarthquakeStats()
    ]);
    
    if (earthquakesResult.error) {
      error.set(earthquakesResult.error);
    } else {
      earthquakes.set(earthquakesResult.data);
    }
    
    if (statsResult.error) {
      console.warn('Failed to load stats:', statsResult.error);
    } else {
      earthquakeStats.set(statsResult.data);
    }
    
    filters.set(newFilters);
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Failed to load earthquakes');
  } finally {
    loading.set(false);
  }
};

export const updateFilters = async (newFilters: Partial<EarthquakeFilters>) => {
  const currentFilters = await new Promise<EarthquakeFilters>((resolve) => {
    const unsubscribe = filters.subscribe(resolve);
    unsubscribe();
  });
  
  const updatedFilters = { ...currentFilters, ...newFilters };
  await loadEarthquakes(updatedFilters);
};

export const clearFilters = async () => {
  await loadEarthquakes({});
};
