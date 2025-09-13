import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch, platform }) => {
	try {
		// Get query parameters from the request
		const searchParams = url.searchParams;
		
		// Get API URL from environment variable
		// In Cloudflare Workers, use platform.env.API_URL
		// In local development, use env.API_URL
		let baseUrl = platform?.env?.API_URL;
		if (!baseUrl) {
			try {
				baseUrl = env.API_URL;
			} catch (e) {
				// env might not be available in Cloudflare Workers
			}
		}
		
		if (!baseUrl) {
			throw new Error('API_URL environment variable is not configured');
		}
		
		const apiUrl = new URL('/api/quakes', baseUrl);
		
		// Copy all query parameters to the API request
		searchParams.forEach((value, key) => {
			apiUrl.searchParams.set(key, value);
		});

		// Debug logging removed for production

		// Prefer Cloudflare Service Binding when available to avoid external HTTP
		const apiBinding = (platform as any)?.API || (platform as any)?.env?.API;
		const useService = apiBinding && typeof apiBinding.fetch === 'function';
		const upstreamFetch = useService ? apiBinding.fetch.bind(apiBinding) : fetch;
		const response = await upstreamFetch(apiUrl.toString());
		
		if (!response.ok) {
			const errorBody = await response.text().catch(() => '');
			throw new Error(`API request failed: ${response.status} -> ${apiUrl.toString()} :: ${errorBody?.slice(0,200)}`);
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
