<script lang="ts">
	import type { EarthquakeFeatureCollection } from '$lib/stores/earthquakes';

	interface Props {
		projection: string;
		onToggleProjection: () => void;
		onRefreshData: () => void;
		earthquakeStore: EarthquakeFeatureCollection;
	}

	const { projection, onToggleProjection, onRefreshData, earthquakeStore }: Props = $props();
</script>

<div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
	<button
		class="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow transition-colors duration-200"
		onclick={onToggleProjection}
		type="button"
		aria-label="Toggle map projection"
	>
		Toggle Projection
	</button>
	
	<button
		class="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow transition-colors duration-200"
		onclick={onRefreshData}
		type="button"
		aria-label="Refresh earthquake data"
	>
		Refresh Data
	</button>
	
	{#if earthquakeStore.metadata.total > 0}
		<div class="bg-white p-3 rounded shadow">
			<p class="text-sm font-semibold">Earthquakes: {earthquakeStore.metadata.total}</p>
			<p class="text-xs text-gray-600">Updated: {new Date(earthquakeStore.metadata.generated).toLocaleTimeString()}</p>
		</div>
	{/if}
</div>
