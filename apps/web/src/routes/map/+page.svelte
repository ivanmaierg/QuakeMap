<script lang="ts">
	import EarthquakeMap from '$lib/components/EarthquakeMap.svelte';
	import EarthquakeFilters from '$lib/components/EarthquakeFilters.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { earthquakes } from '$lib/stores/earthquakes';
</script>

<svelte:head>
	<title>Earthquake Map - QuakeMap</title>
	<meta name="description" content="Interactive earthquake map showing real-time seismic activity" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
	<!-- Header -->
	<div class="bg-white dark:bg-slate-800 shadow-sm border-b">
		<div class="container mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
						Earthquake Map
					</h1>
					<p class="text-slate-600 dark:text-slate-400">
						Real-time seismic activity visualization
					</p>
				</div>
				<div class="flex gap-2">
					<Button variant="outline" onclick={() => window.history.back()}>
						← Back
					</Button>
					<Button onclick={() => earthquakes.fetchEarthquakes({ limit: 100 })}>
						Refresh Data
					</Button>
				</div>
			</div>
		</div>
	</div>

	<!-- Map Container -->
	<div class="container mx-auto px-4 py-6">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
			<!-- Map -->
			<div class="lg:col-span-3">
				<Card class="overflow-hidden">
					<CardContent class="p-0">
						<div class="aspect-video w-full">
							<EarthquakeMap />
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Filters -->
				<EarthquakeFilters />
				<!-- Legend -->
				<Card>
					<CardHeader>
						<CardTitle class="text-lg">Magnitude Legend</CardTitle>
						<CardDescription>
							Earthquake magnitude scale
						</CardDescription>
					</CardHeader>
					<CardContent class="space-y-2">
						<div class="flex items-center gap-2">
							<div class="w-5 h-5 rounded-full bg-green-400 border-2 border-white shadow-sm flex items-center justify-center">
								<span class="text-xs text-white font-bold">1</span>
							</div>
							<span class="text-sm">1.0 - 2.9</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-sm flex items-center justify-center">
								<span class="text-xs text-white font-bold">3</span>
							</div>
							<span class="text-sm">3.0 - 3.9</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-7 h-7 rounded-full bg-yellow-500 border-2 border-white shadow-sm flex items-center justify-center">
								<span class="text-xs text-white font-bold">4</span>
							</div>
							<span class="text-sm">4.0 - 4.9</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-full bg-orange-500 border-2 border-white shadow-sm flex items-center justify-center">
								<span class="text-xs text-white font-bold">5</span>
							</div>
							<span class="text-sm">5.0 - 5.9</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-9 h-9 rounded-full bg-red-500 border-2 border-white shadow-sm flex items-center justify-center">
								<span class="text-sm text-white font-bold">6</span>
							</div>
							<span class="text-sm">6.0 - 6.9</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-10 h-10 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center">
								<span class="text-sm text-white font-bold">7</span>
							</div>
							<span class="text-sm">7.0+</span>
						</div>
					</CardContent>
				</Card>

				<!-- Statistics -->
				<Card>
					<CardHeader>
						<CardTitle class="text-lg">Statistics</CardTitle>
					</CardHeader>
					<CardContent class="space-y-2">
						<div class="flex justify-between">
							<span class="text-sm text-slate-600 dark:text-slate-400">Total Earthquakes:</span>
							<span class="text-sm font-semibold">{$earthquakes.metadata.total}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-sm text-slate-600 dark:text-slate-400">Last Updated:</span>
							<span class="text-sm font-semibold">
								{new Date($earthquakes.metadata.generated).toLocaleTimeString()}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-sm text-slate-600 dark:text-slate-400">Data Limit:</span>
							<span class="text-sm font-semibold">{$earthquakes.metadata.limit}</span>
						</div>
					</CardContent>
				</Card>

				<!-- Instructions -->
				<Card>
					<CardHeader>
						<CardTitle class="text-lg">How to Use</CardTitle>
					</CardHeader>
					<CardContent class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
						<p>• Click on earthquake circles to see details</p>
						<p>• Use mouse wheel to zoom in/out</p>
						<p>• Drag to pan around the map</p>
						<p>• Toggle between globe and mercator projections</p>
						<p>• Refresh data to get latest earthquakes</p>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</div>
