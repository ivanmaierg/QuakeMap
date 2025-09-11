<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { earthquakes } from '$lib/stores/earthquakes';
	import type { EarthquakeFilters } from '$lib/stores/earthquakes';

	let filters = $state<EarthquakeFilters>({
		magnitude: undefined,
		startDate: undefined,
		endDate: undefined,
		limit: 100
	});

	let isExpanded = $state(false);

	const handleApplyFilters = () => {
		console.log('Applying filters:', filters);
		earthquakes.fetchEarthquakes(filters);
	};

	const handleResetFilters = () => {
		filters = {
			magnitude: undefined,
			startDate: undefined,
			endDate: undefined,
			limit: 100
		};
		earthquakes.fetchEarthquakes(filters);
	};

	const handleMagnitudeChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		filters.magnitude = target.value ? parseFloat(target.value) : undefined;
	};

	const handleLimitChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		filters.limit = target.value ? parseInt(target.value) : 100;
	};

	// Get current date for max date
	const today = new Date().toISOString().split('T')[0];
</script>

<Card class="w-full">
	<CardHeader>
		<div class="flex items-center justify-between">
			<div>
				<CardTitle class="text-lg">Earthquake Filters</CardTitle>
				<CardDescription>
					Filter earthquakes by magnitude, date, and other criteria
				</CardDescription>
			</div>
			<Button
				variant="outline"
				size="sm"
				onclick={() => isExpanded = !isExpanded}
			>
				{isExpanded ? 'Collapse' : 'Expand'}
			</Button>
		</div>
	</CardHeader>
	
	<CardContent class="space-y-4">
		<!-- Quick Filters -->
		<div class="grid grid-cols-2 gap-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					filters.magnitude = 4;
					handleApplyFilters();
				}}
			>
				Magnitude 4+
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					filters.magnitude = 5;
					handleApplyFilters();
				}}
			>
				Magnitude 5+
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					filters.magnitude = 6;
					handleApplyFilters();
				}}
			>
				Magnitude 6+
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					filters.magnitude = 7;
					handleApplyFilters();
				}}
			>
				Magnitude 7+
			</Button>
		</div>

		{#if isExpanded}
			<!-- Advanced Filters -->
			<div class="space-y-4 pt-4 border-t">
				<!-- Magnitude Filter -->
				<div>
					<label for="magnitude" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
						Minimum Magnitude
					</label>
					<input
						id="magnitude"
						type="number"
						min="0"
						max="10"
						step="0.1"
						placeholder="e.g., 4.0"
						class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100"
						oninput={handleMagnitudeChange}
					/>
				</div>

				<!-- Date Range -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="startDate" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Start Date
						</label>
						<input
							id="startDate"
							type="date"
							max={today}
							class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100"
							bind:value={filters.startDate}
						/>
					</div>
					<div>
						<label for="endDate" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							End Date
						</label>
						<input
							id="endDate"
							type="date"
							max={today}
							class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100"
							bind:value={filters.endDate}
						/>
					</div>
				</div>

				<!-- Limit -->
				<div>
					<label for="limit" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
						Number of Results
					</label>
					<select
						id="limit"
						class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100"
						onchange={handleLimitChange}
					>
						<option value="50">50 earthquakes</option>
						<option value="100" selected>100 earthquakes</option>
						<option value="200">200 earthquakes</option>
						<option value="500">500 earthquakes</option>
						<option value="1000">1000 earthquakes</option>
					</select>
				</div>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex gap-2 pt-4 border-t">
			<Button onclick={handleApplyFilters} class="flex-1">
				Apply Filters
			</Button>
			<Button variant="outline" onclick={handleResetFilters}>
				Reset
			</Button>
		</div>

		<!-- Current Filter Summary -->
		{#if filters.magnitude || filters.startDate || filters.endDate}
			<div class="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded">
				<p class="font-medium mb-1">Active Filters:</p>
				<ul class="space-y-1">
					{#if filters.magnitude}
						<li>• Minimum magnitude: {filters.magnitude}</li>
					{/if}
					{#if filters.startDate}
						<li>• From: {new Date(filters.startDate).toLocaleDateString()}</li>
					{/if}
					{#if filters.endDate}
						<li>• To: {new Date(filters.endDate).toLocaleDateString()}</li>
					{/if}
					<li>• Limit: {filters.limit} earthquakes</li>
				</ul>
			</div>
		{/if}
	</CardContent>
</Card>
