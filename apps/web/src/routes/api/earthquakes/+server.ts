import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch, platform }) => {
	try {
		// Get query parameters from the request
		const searchParams = url.searchParams;
		
		// Prefer Cloudflare Service Binding when available to avoid external HTTP
		const apiBinding = (platform as any)?.API || (platform as any)?.env?.API;
		const useService = apiBinding && typeof apiBinding.fetch === 'function';
		
		let apiUrl: URL;
		let upstreamFetch: typeof fetch;
		
		if (useService) {
			// Use service binding - no need for external URL
			console.log('🔗 Using service binding for API call');
			apiUrl = new URL('/api/quakes', 'http://internal');
			upstreamFetch = apiBinding.fetch.bind(apiBinding);
		} else {
			// Fallback to external API URL
			console.log('🌐 Using external API URL (no service binding available)');
			let baseUrl = platform?.env?.API_URL;
			if (!baseUrl) {
				try {
					baseUrl = env.API_URL;
				} catch (e) {
					// env might not be available in Cloudflare Workers
				}
			}
			
			if (!baseUrl) {
				throw new Error('API_URL environment variable is not configured and service binding not available');
			}
			
			console.log('🌐 Using API URL:', baseUrl);
			apiUrl = new URL('/api/quakes', baseUrl);
			upstreamFetch = fetch;
		}
		
		// Copy all query parameters to the API request
		searchParams.forEach((value, key) => {
			apiUrl.searchParams.set(key, value);
		});

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
