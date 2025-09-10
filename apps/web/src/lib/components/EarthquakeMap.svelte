<script lang="ts">
	import MapLibre from 'svelte-maplibre/MapLibre.svelte';
	import Marker from 'svelte-maplibre/Marker.svelte';
	import Popup from 'svelte-maplibre/Popup.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { earthquakes } from '$lib/stores/earthquakes';
	import type { EarthquakeFeature } from '$lib/stores/earthquakes';

	let projection = $state('globe');
	let earthquakeData = $derived($earthquakes);
	let selectedEarthquake = $state<EarthquakeFeature | null>(null);

	const handleToggleProjection = () => {
		projection = projection === 'globe' ? 'mercator' : 'globe';
	};

	const getMagnitudeColor = (magnitude: number): string => {
		if (magnitude >= 7) return 'bg-red-600';
		if (magnitude >= 6) return 'bg-red-500';
		if (magnitude >= 5) return 'bg-orange-500';
		if (magnitude >= 4) return 'bg-yellow-500';
		if (magnitude >= 3) return 'bg-green-500';
		return 'bg-green-400';
	};

	const getMagnitudeSize = (magnitude: number): string => {
		if (magnitude >= 7) return 'h-10 w-10 text-sm';
		if (magnitude >= 6) return 'h-9 w-9 text-sm';
		if (magnitude >= 5) return 'h-8 w-8 text-xs';
		if (magnitude >= 4) return 'h-7 w-7 text-xs';
		if (magnitude >= 3) return 'h-6 w-6 text-xs';
		return 'h-5 w-5 text-xs';
	};

	onMount(() => {
		// Fetch initial earthquake data
		earthquakes.fetchEarthquakes({ limit: 100 });
	});
</script>

<div class="w-full h-full relative">
	<!-- Map Controls -->
	<div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
		<button
			class="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow"
			onclick={handleToggleProjection}
		>
			Toggle Projection
		</button>
		
		<button
			class="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow"
			onclick={() => earthquakes.fetchEarthquakes({ limit: 100 })}
		>
			Refresh Data
		</button>
		
		<!-- Earthquake Stats -->
		{#if $earthquakes.metadata.total > 0}
			<div class="bg-white p-3 rounded shadow">
				<p class="text-sm font-semibold">Earthquakes: {$earthquakes.metadata.total}</p>
				<p class="text-xs text-gray-600">Updated: {new Date($earthquakes.metadata.generated).toLocaleTimeString()}</p>
			</div>
		{/if}
	</div>

	<!-- Loading Indicator -->
	{#if $earthquakes.loading}
		<div class="absolute top-4 left-4 z-10 bg-white p-3 rounded shadow">
			<div class="flex items-center gap-2">
				<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
				<span class="text-sm">Loading earthquakes...</span>
			</div>
		</div>
	{/if}

	<!-- Error Message -->
	{#if $earthquakes.error}
		<div class="absolute top-4 left-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			<p class="text-sm">Error: {$earthquakes.error}</p>
		</div>
	{/if}

	<!-- Map Component -->
	<MapLibre
		style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
		class="w-full h-full"
		standardControls
		projection={{ type: projection }}
		zoom={2}
		center={[-20, 0]}
	>
		{#each earthquakeData.features as earthquake (earthquake.properties.id)}
			<Marker
				lngLat={earthquake.geometry.coordinates}
				onclick={() => (selectedEarthquake = earthquake)}
				class="grid place-items-center rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform {getMagnitudeColor(earthquake.properties.magnitude)} {getMagnitudeSize(earthquake.properties.magnitude)}"
			>
				<span class="text-white font-bold">
					{earthquake.properties.magnitude.toFixed(1)}
				</span>

				<Popup openOn="click" offset={[0, -10]}>
					<div class="p-3 min-w-[250px]">
						<h3 class="font-bold text-lg mb-2">{earthquake.properties.title}</h3>
						<p class="text-sm text-gray-600 mb-2">{earthquake.properties.place}</p>
						<div class="space-y-1">
							<p class="text-sm"><strong>Magnitude:</strong> {earthquake.properties.magnitude}</p>
							<p class="text-sm"><strong>Time:</strong> {new Date(earthquake.properties.time).toLocaleString()}</p>
							<p class="text-sm"><strong>Status:</strong> {earthquake.properties.status}</p>
							<p class="text-sm"><strong>Depth:</strong> {earthquake.geometry.coordinates[2]?.toFixed(1) || 'N/A'} km</p>
							{#if earthquake.properties.tsunami}
								<p class="text-sm text-red-600 font-semibold">⚠️ Tsunami Warning!</p>
							{/if}
						</div>
					</div>
				</Popup>
			</Marker>
		{/each}
	</MapLibre>

	<!-- Selected Earthquake Info -->
	{#if selectedEarthquake}
		<div class="absolute bottom-4 left-4 right-4 z-10 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg p-4">
			<div class="flex items-center justify-between mb-2">
				<h3 class="font-bold text-lg">{selectedEarthquake.properties.title}</h3>
				<button
					class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					onclick={() => (selectedEarthquake = null)}
				>
					✕
				</button>
			</div>
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div>
					<p><strong>Location:</strong> {selectedEarthquake.properties.place}</p>
					<p><strong>Magnitude:</strong> {selectedEarthquake.properties.magnitude}</p>
					<p><strong>Depth:</strong> {selectedEarthquake.geometry.coordinates[2]?.toFixed(1) || 'N/A'} km</p>
				</div>
				<div>
					<p><strong>Time:</strong> {new Date(selectedEarthquake.properties.time).toLocaleString()}</p>
					<p><strong>Status:</strong> {selectedEarthquake.properties.status}</p>
					{#if selectedEarthquake.properties.tsunami}
						<p class="text-red-600 font-semibold">⚠️ Tsunami Warning!</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
