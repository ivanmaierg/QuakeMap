<script lang="ts">
	import Marker from 'svelte-maplibre/Marker.svelte';
	import type { EarthquakeFeature } from '$lib/stores/earthquakes';
	import { getMagnitudeColor, getMagnitudeSize } from '$lib/utils/earthquake';

	interface Props {
		earthquake: EarthquakeFeature;
		onSelect: (earthquake: EarthquakeFeature) => void;
	}

	const { earthquake, onSelect }: Props = $props();

	const handleClick = () => {
		onSelect(earthquake);
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect(earthquake);
		}
	};
</script>

<Marker
	lngLat={earthquake.geometry.coordinates}
	onclick={handleClick}
	class="grid place-items-center rounded-full border-2 border-white shadow-lg cursor-pointer hover:shadow-xl hover:border-4 transition-all duration-200 {getMagnitudeColor(earthquake.properties.magnitude)} {getMagnitudeSize(earthquake.properties.magnitude)}"
	role="button"
	tabindex="0"
	aria-label="Earthquake magnitude {earthquake.properties.magnitude.toFixed(1)} at {earthquake.properties.place}"
	onkeydown={handleKeyDown}
>
	<span class="text-white font-bold">
		{earthquake.properties.magnitude.toFixed(1)}
	</span>
</Marker>
