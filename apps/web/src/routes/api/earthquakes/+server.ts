import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ url, fetch }) => {
	try {
		// Get query parameters from the request
		const searchParams = url.searchParams;
		
		// Forward the request to the backend API
		const baseUrl = env.API_URL || 'http://localhost:8787';
		const apiUrl = new URL('/earthquakes', baseUrl);
		
		// Copy all query parameters to the API request
		searchParams.forEach((value, key) => {
			apiUrl.searchParams.set(key, value);
		});

		const response = await fetch(apiUrl.toString());
		
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
