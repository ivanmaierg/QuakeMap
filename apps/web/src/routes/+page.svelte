<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, Card, LoadingSpinner } from '@quake-map/ui';

  let mapContainer: HTMLDivElement;
  let map: any;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      // Dynamic import for MapLibre GL JS
      const maplibregl = await import('maplibre-gl');
      
      map = new maplibregl.Map({
        container: mapContainer,
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: [0, 0],
        zoom: 2
      });

      map.on('load', () => {
        loading = false;
      });

      map.on('error', (e: any) => {
        error = 'Failed to load map';
        loading = false;
      });
    } catch (err) {
      error = 'Failed to initialize map';
      loading = false;
      console.error('Map initialization error:', err);
    }
  });
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
    <aside class="w-80 bg-white shadow-lg border-r border-secondary-200 p-4">
      <div class="space-y-6">
        <!-- Statistics -->
        <Card>
          <h2 class="text-lg font-semibold mb-4">Earthquake Statistics</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-secondary-600">Total Earthquakes:</span>
              <span class="font-medium">-</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary-600">Max Magnitude:</span>
              <span class="font-medium">-</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary-600">Last Update:</span>
              <span class="font-medium">-</span>
            </div>
          </div>
        </Card>

        <!-- Filters -->
        <Card>
          <h2 class="text-lg font-semibold mb-4">Filters</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Magnitude Range
              </label>
              <div class="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  class="flex-1"
                />
                <span class="text-sm text-secondary-600">0 - 10</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Time Range
              </label>
              <select class="w-full p-2 border border-secondary-300 rounded-md">
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>All time</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </aside>

    <!-- Map Container -->
    <main class="flex-1 relative">
      {#if loading}
        <div class="absolute inset-0 flex items-center justify-center bg-secondary-100">
          <div class="text-center">
            <LoadingSpinner size="lg" />
            <p class="mt-4 text-secondary-600">Loading map...</p>
          </div>
        </div>
      {:else if error}
        <div class="absolute inset-0 flex items-center justify-center bg-secondary-100">
          <Card>
            <div class="text-center">
              <p class="text-red-600 mb-4">{error}</p>
              <Button variant="primary" on:click={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </Card>
        </div>
      {:else}
        <div bind:this={mapContainer} class="map-container"></div>
      {/if}
    </main>
  </div>
</div>
