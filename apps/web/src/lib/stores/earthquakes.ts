import { writable } from 'svelte/store';

export interface EarthquakeFeature {
	type: 'Feature';
	geometry: {
		type: 'Point';
		coordinates: [number, number] | [number, number, number]; // [longitude, latitude] or [longitude, latitude, depth]
	};
	properties: {
		id: string;
		magnitude: number;
		place: string;
		time: string;
		updated: string;
		url: string;
		detail: string;
		felt: number | null;
		cdi: number | null;
		mmi: number | null;
		alert: string | null;
		status: string;
		tsunami: number;
		sig: number;
		net: string;
		code: string;
		ids: string;
		sources: string;
		types: string;
		nst: number | null;
		dmin: number | null;
		rms: number;
		gap: number | null;
		magType: string;
		type: string;
		title: string;
	};
}

export interface EarthquakeFeatureCollection {
  loading: any;
  error: any;
	type: 'FeatureCollection';
	features: EarthquakeFeature[];
	metadata: {
		total: number;
		limit: number;
		generated: string;
	};
}

export interface EarthquakeFilters {
	magnitude?: number; // Used as minMagnitude in API calls
	startDate?: string;
	endDate?: string;
	limit?: number;
}

const createEarthquakeStore = () => {
	const { subscribe, set, update } = writable<EarthquakeFeatureCollection>({
		type: 'FeatureCollection',
		features: [],
		metadata: {
			total: 0,
			limit: 1000,
			generated: new Date().toISOString()
		}
	});

	const loading = writable(false);
	const error = writable<string | null>(null);

	const fetchEarthquakes = async (filters: EarthquakeFilters = {}) => {
		loading.set(true);
		error.set(null);

		try {
			const params = new URLSearchParams();
			
			if (filters.magnitude) {
				params.append('minMagnitude', filters.magnitude.toString());
			}
			if (filters.startDate) {
				params.append('startDate', filters.startDate);
			}
			if (filters.endDate) {
				params.append('endDate', filters.endDate);
			}
			if (filters.limit) {
				params.append('limit', filters.limit.toString());
			}

			const response = await fetch(`/api/earthquakes?${params.toString()}`);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: EarthquakeFeatureCollection = await response.json();
			// Removed debug log
			set(data);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch earthquakes';
			error.set(errorMessage);
			console.error('Error fetching earthquakes:', err);
		} finally {
			loading.set(false);
		}
	};

	return {
		subscribe,
		loading: { subscribe: loading.subscribe },
		error: { subscribe: error.subscribe },
		fetchEarthquakes,
		set,
		update
	};
};

export const earthquakes = createEarthquakeStore();
