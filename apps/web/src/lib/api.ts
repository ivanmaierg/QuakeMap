import type { EarthquakeFeatureCollection, EarthquakeStats } from '@quake-map/db';

const API_BASE_URL = 'http://localhost:8787/api';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export const fetchEarthquakes = async (params: Record<string, string | number> = {}): Promise<ApiResponse<EarthquakeFeatureCollection>> => {
  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const url = `${API_BASE_URL}/quakes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching earthquakes:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch earthquakes' 
    };
  }
};

export const fetchEarthquakeStats = async (): Promise<ApiResponse<EarthquakeStats>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/quakes/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching earthquake stats:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch earthquake statistics' 
    };
  }
};

export const fetchEarthquakeById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/quakes/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching earthquake by ID:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch earthquake details' 
    };
  }
};
