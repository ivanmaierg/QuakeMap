import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch, platform }) => {
	try {
		// Get query parameters from the request
		const searchParams = url.searchParams;
		
		// Forward the request to the backend API
		// Temporarily hardcode the API URL to test the proxy
		const baseUrl = 'https://quake-map-api-dev.ivanmaierg99.workers.dev';
		const apiUrl = new URL('/api/quakes', baseUrl);
		
		// Copy all query parameters to the API request
		searchParams.forEach((value, key) => {
			apiUrl.searchParams.set(key, value);
		});

		console.log('🌐 Web app proxy - API_URL:', baseUrl);
		console.log('🌐 Web app proxy - Full API URL:', apiUrl.toString());
		console.log('🌐 Web app proxy - Platform env keys:', Object.keys(platform?.env || {}));
		console.log('🌐 Web app proxy - Platform env API_URL:', platform?.env?.API_URL);

		const response = await fetch(apiUrl.toString(), {
			headers: {
				'Origin': 'https://quake-map-web-dev.ivanmaierg99.workers.dev'
			}
		});
		
		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}

		const data = await response.json();
		
		return json(data);
	} catch (error) {
		console.error('Error proxying earthquake data:', error);
		
		return json(
			{
				error: 'Failed to fetch earthquake data',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
