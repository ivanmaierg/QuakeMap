<script lang="ts">
	import type { EarthquakeFeature } from '$lib/stores/earthquakes';
	import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { 
		getMagnitudeColor, 
		getMagnitudeLabel, 
		getAlertColor, 
		formatDateTime, 
		getUSGSUrl, 
		getGoogleMapsUrl 
	} from '$lib/utils/earthquake';

	interface Props {
		earthquake: EarthquakeFeature;
		onClose: () => void;
	}

	const { earthquake, onClose }: Props = $props();

	const { date, time } = formatDateTime(earthquake.properties.time);

	const handleUSGSClick = () => {
		const url = getUSGSUrl(earthquake);
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	const handleMapsClick = () => {
		const url = getGoogleMapsUrl(earthquake.geometry.coordinates);
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	const getDepth = (coordinates: [number, number] | [number, number, number]): string => {
		return coordinates.length === 3 ? coordinates[2].toFixed(1) : 'N/A';
	};
</script>

<div class="absolute bottom-4 left-4 right-4 z-10 max-w-2xl mx-auto">
	<Card class="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
		<CardHeader class="pb-4">
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<CardTitle class="text-xl font-bold text-gray-900 mb-2">
						{earthquake.properties.title}
					</CardTitle>
					<div class="flex items-center gap-3 mb-3">
						<div class="flex items-center gap-2">
							<div class="w-4 h-4 rounded-full {getMagnitudeColor(earthquake.properties.magnitude)}"></div>
							<span class="text-2xl font-bold text-gray-900">
								M {earthquake.properties.magnitude.toFixed(1)}
							</span>
							<span class="text-sm text-gray-600 font-medium">
								({getMagnitudeLabel(earthquake.properties.magnitude)})
							</span>
						</div>
						{#if earthquake.properties.alert}
							<div class="px-2 py-1 rounded-full text-xs font-semibold border {getAlertColor(earthquake.properties.alert)}">
								{earthquake.properties.alert.toUpperCase()} ALERT
							</div>
						{/if}
					</div>
					{#if earthquake.properties.tsunami}
						<div class="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
							<span class="text-red-600 text-lg" role="img" aria-label="Tsunami warning">🌊</span>
							<span class="text-red-800 font-semibold text-sm">Tsunami Warning Active</span>
						</div>
					{/if}
				</div>
				<Button
					variant="ghost"
					size="icon"
					class="text-gray-500 hover:text-gray-700 h-8 w-8"
					onclick={onClose}
					aria-label="Close earthquake details"
				>
					✕
				</Button>
			</div>
		</CardHeader>

		<CardContent class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="space-y-3">
					<div>
						<h4 class="text-sm font-semibold text-gray-700 mb-1">Location</h4>
						<p class="text-gray-900">{earthquake.properties.place}</p>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<h4 class="text-sm font-semibold text-gray-700 mb-1">Depth</h4>
							<p class="text-gray-900">{getDepth(earthquake.geometry.coordinates)} km</p>
						</div>
						<div>
							<h4 class="text-sm font-semibold text-gray-700 mb-1">Status</h4>
							<p class="text-gray-900 capitalize">{earthquake.properties.status}</p>
						</div>
					</div>
				</div>
				<div class="space-y-3">
					<div>
						<h4 class="text-sm font-semibold text-gray-700 mb-1">Date & Time</h4>
						<p class="text-gray-900">{date}</p>
						<p class="text-gray-600 text-sm">{time}</p>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<h4 class="text-sm font-semibold text-gray-700 mb-1">Type</h4>
							<p class="text-gray-900 capitalize">{earthquake.properties.magType}</p>
						</div>
						{#if earthquake.properties.sig}
							<div>
								<h4 class="text-sm font-semibold text-gray-700 mb-1">Significance</h4>
								<p class="text-gray-900">{earthquake.properties.sig}</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			{#if earthquake.properties.felt || earthquake.properties.cdi || earthquake.properties.mmi}
				<div class="border-t pt-4">
					<h4 class="text-sm font-semibold text-gray-700 mb-3">Impact Data</h4>
					<div class="grid grid-cols-3 gap-4">
						{#if earthquake.properties.felt}
							<div class="text-center p-3 bg-gray-50 rounded-lg">
								<p class="text-2xl font-bold text-blue-600">{earthquake.properties.felt.toLocaleString()}</p>
								<p class="text-xs text-gray-600">Reports</p>
							</div>
						{/if}
						{#if earthquake.properties.cdi}
							<div class="text-center p-3 bg-gray-50 rounded-lg">
								<p class="text-2xl font-bold text-green-600">{earthquake.properties.cdi.toFixed(1)}</p>
								<p class="text-xs text-gray-600">CDI</p>
							</div>
						{/if}
						{#if earthquake.properties.mmi}
							<div class="text-center p-3 bg-gray-50 rounded-lg">
								<p class="text-2xl font-bold text-orange-600">{earthquake.properties.mmi.toFixed(1)}</p>
								<p class="text-xs text-gray-600">MMI</p>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</CardContent>

		<CardFooter class="flex gap-3 pt-4">
			<Button
				onclick={handleUSGSClick}
				class="flex-1"
				aria-label="View earthquake details on USGS website"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
				</svg>
				View on USGS
			</Button>
			<Button
				variant="outline"
				onclick={handleMapsClick}
				aria-label="View earthquake location on Google Maps"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
				</svg>
				View on Maps
			</Button>
		</CardFooter>
	</Card>
</div>
