import type { EarthquakeFeature } from '$lib/stores/earthquakes';

export const getMagnitudeColor = (magnitude: number): string => {
	if (magnitude >= 7) return 'bg-red-600';
	if (magnitude >= 6) return 'bg-red-500';
	if (magnitude >= 5) return 'bg-orange-500';
	if (magnitude >= 4) return 'bg-yellow-500';
	if (magnitude >= 3) return 'bg-green-500';
	return 'bg-green-400';
};

export const getMagnitudeSize = (magnitude: number): string => {
	if (magnitude >= 7) return 'h-10 w-10 text-sm';
	if (magnitude >= 6) return 'h-9 w-9 text-sm';
	if (magnitude >= 5) return 'h-8 w-8 text-xs';
	if (magnitude >= 4) return 'h-7 w-7 text-xs';
	if (magnitude >= 3) return 'h-6 w-6 text-xs';
	return 'h-5 w-5 text-xs';
};

export const getMagnitudeLabel = (magnitude: number): string => {
	if (magnitude >= 8) return 'Great';
	if (magnitude >= 7) return 'Major';
	if (magnitude >= 6) return 'Strong';
	if (magnitude >= 5) return 'Moderate';
	if (magnitude >= 4) return 'Light';
	if (magnitude >= 3) return 'Minor';
	return 'Micro';
};

export const getAlertColor = (alert: string | null): string => {
	switch (alert) {
		case 'red': return 'bg-red-100 text-red-800 border-red-200';
		case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
		case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		case 'green': return 'bg-green-100 text-green-800 border-green-200';
		default: return 'bg-gray-100 text-gray-800 border-gray-200';
	}
};

export const formatDateTime = (timestamp: string): { date: string; time: string } => {
	const date = new Date(timestamp);
	return {
		date: date.toLocaleDateString(),
		time: date.toLocaleTimeString()
	};
};

export const getUSGSUrl = (earthquake: EarthquakeFeature): string => {
	return earthquake.properties.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${earthquake.properties.id}`;
};

export const getGoogleMapsUrl = (coordinates: [number, number] | [number, number, number]): string => {
	return `https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`;
};
