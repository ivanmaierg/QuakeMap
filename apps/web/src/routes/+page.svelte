<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '@quake-map/ui';
  import EarthquakeMap from '../lib/components/EarthquakeMap.svelte';
  import EarthquakeFilters from '../lib/components/EarthquakeFilters.svelte';
  import EarthquakeStats from '../lib/components/EarthquakeStats.svelte';
  import EarthquakeDetails from '../lib/components/EarthquakeDetails.svelte';
  import { loadEarthquakes, loading, error } from '../lib/stores/earthquakes';

  let mapContainer: HTMLDivElement;
  let selectedEarthquake: any = null;
  let showDetails = false;

  onMount(async () => {
    // Load initial earthquake data
    await loadEarthquakes();
  });

  const handleEarthquakeClick = (earthquake: any) => {
    selectedEarthquake = earthquake;
    showDetails = true;
  };

  const handleCloseDetails = () => {
    showDetails = false;
    selectedEarthquake = null;
  };
</script>

<svelte:head>
  <title>QuakeMap - Real-time Earthquake Visualization</title>
  <meta name="description" content="Real-time earthquake map visualization with interactive filtering and statistics" />
</svelte:head>

<div class="h-screen flex flex-col">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-secondary-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-primary-600">🌎 QuakeMap</h1>
        </div>
        <nav class="flex space-x-4">
          <Button variant="outline" size="sm">About</Button>
          <Button variant="primary" size="sm">Settings</Button>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <div class="flex-1 flex">
    <!-- Sidebar -->
    <aside class="w-80 bg-white shadow-lg border-r border-gray-200 p-4 overflow-y-auto">
      <div class="space-y-6">
        <!-- Statistics -->
        <EarthquakeStats />

        <!-- Filters -->
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-4">Filters</h2>
          <EarthquakeFilters />
        </div>
      </div>
    </aside>

    <!-- Map Container -->
    <main class="flex-1 relative">
      <EarthquakeMap 
        bind:mapContainer={mapContainer} 
        onEarthquakeClick={handleEarthquakeClick}
      />
    </main>
  </div>

  <!-- Earthquake Details Modal -->
  <EarthquakeDetails 
    bind:earthquake={selectedEarthquake}
    bind:isOpen={showDetails}
    on:close={handleCloseDetails}
  />
</div>
