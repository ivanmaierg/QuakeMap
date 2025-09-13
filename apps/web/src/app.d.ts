// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				API_URL?: string;
				API?: Fetcher;
				[key: string]: unknown;
			};
		}
	}
}

// Environment variables
declare module '$env/dynamic/private' {
	export const env: {
		API_URL?: string;
		[key: string]: string | undefined;
	};
}

export {};
