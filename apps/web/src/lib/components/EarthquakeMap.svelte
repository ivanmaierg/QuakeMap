<script lang="ts">
	import { MapLibre } from 'svelte-maplibre';
	import { onMount } from 'svelte';
	import { earthquakes } from '$lib/stores/earthquakes';
	import type { EarthquakeFeature } from '$lib/stores/earthquakes';
	
	import MapControls from './MapControls.svelte';
	import LoadingIndicator from './LoadingIndicator.svelte';
	import ErrorMessage from './ErrorMessage.svelte';
	import EarthquakeMarker from './EarthquakeMarker.svelte';
	import EarthquakeDetailCard from './EarthquakeDetailCard.svelte';

	let projection = $state('globe');
	let earthquakeData = $derived($earthquakes);
	let selectedEarthquake = $state<EarthquakeFeature | null>(null);
	let isLoading = $derived($earthquakes.loading);
	let errorMessage = $derived($earthquakes.error);

	const handleToggleProjection = () => {
		projection = projection === 'globe' ? 'mercator' : 'globe';
	};

	const handleRefreshData = () => {
		earthquakes.fetchEarthquakes({ limit: 100 });
	};

	const handleSelectEarthquake = (earthquake: EarthquakeFeature) => {
		selectedEarthquake = earthquake;
	};

	const handleCloseDetails = () => {
		selectedEarthquake = null;
	};

	onMount(() => {
		earthquakes.fetchEarthquakes({ limit: 100 });
	});
</script>

<div class="w-full h-full relative">
	<MapControls
		{projection}
		onToggleProjection={handleToggleProjection}
		onRefreshData={handleRefreshData}
		earthquakeStore={earthquakeData}
	/>

	{#if isLoading}
		<LoadingIndicator />
	{/if}

	{#if errorMessage}
		<ErrorMessage error={errorMessage} />
	{/if}

	<MapLibre
		style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
		class="w-full h-full"
		standardControls
		projection={{ type: projection }}
		zoom={2}
		center={[-20, 0]}
	>
		{#each earthquakeData.features as earthquake (earthquake.properties.id)}
			<EarthquakeMarker
				{earthquake}
				onSelect={handleSelectEarthquake}
			/>
		{/each}
	</MapLibre>

	{#if selectedEarthquake}
		<EarthquakeDetailCard
			earthquake={selectedEarthquake}
			onClose={handleCloseDetails}
		/>
	{/if}
</div>
