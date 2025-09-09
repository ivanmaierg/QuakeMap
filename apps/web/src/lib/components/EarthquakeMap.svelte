<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { MapLibre } from 'svelte-maplibre';
  import { earthquakes } from '../stores/earthquakes';
  import type { EarthquakeFeatureCollection } from '@quake-map/db';

  export let onEarthquakeClick: (earthquake: any) => void = () => {};

  let map: any;
  let loading = true;
  let error: string | null = null;

  // Magnitude-based styling
  const getMagnitudeColor = (magnitude: number): string => {
    if (magnitude >= 7) return '#dc2626'; // red-600
    if (magnitude >= 6) return '#ea580c'; // orange-600
    if (magnitude >= 5) return '#d97706'; // amber-600
    if (magnitude >= 4) return '#ca8a04'; // yellow-600
    if (magnitude >= 3) return '#65a30d'; // lime-600
    return '#16a34a'; // green-600
  };

  const getMagnitudeSize = (magnitude: number): number => {
    return Math.max(8, Math.min(24, magnitude * 3));
  };

  const handleMapLoad = (mapInstance: any) => {
    map = mapInstance;
    loading = false;
    loadEarthquakeData();
  };

  const handleMapError = (e: any) => {
    error = 'Failed to load map';
    loading = false;
    console.error('Map error:', e);
  };

  // Subscribe to earthquake data changes
  const unsubscribe = earthquakes.subscribe((data) => {
    if (data && map) {
      updateEarthquakeMarkers(data);
    }
  });

  const loadEarthquakeData = () => {
    if (!map) return;
    
    // Add earthquake source and layers
    if (map.getSource('earthquakes')) {
      map.removeLayer('earthquake-circles');
      map.removeLayer('earthquake-labels');
      map.removeSource('earthquakes');
    }

    map.addSource('earthquakes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // Add earthquake circles
    map.addLayer({
      id: 'earthquake-circles',
      type: 'circle',
      source: 'earthquakes',
      paint: {
        'circle-color': [
          'case',
          ['has', 'magnitude'],
          [
            'interpolate',
            ['linear'],
            ['get', 'magnitude'],
            0, '#16a34a', // green-600
            3, '#65a30d', // lime-600
            4, '#ca8a04', // yellow-600
            5, '#d97706', // amber-600
            6, '#ea580c', // orange-600
            7, '#dc2626'  // red-600
          ],
          '#16a34a'
        ],
        'circle-radius': [
          'case',
          ['has', 'magnitude'],
          [
            'interpolate',
            ['linear'],
            ['get', 'magnitude'],
            0, 8,
            10, 24
          ],
          8
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8
      }
    });

    // Add earthquake labels
    map.addLayer({
      id: 'earthquake-labels',
      type: 'symbol',
      source: 'earthquakes',
      layout: {
        'text-field': [
          'case',
          ['has', 'magnitude'],
          ['to-string', ['get', 'magnitude']],
          ''
        ],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-anchor': 'center',
        'text-offset': [0, 0]
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1
      }
    });

    // Add click handler
    map.on('click', 'earthquake-circles', (e: any) => {
      const feature = e.features[0];
      if (feature) {
        onEarthquakeClick(feature.properties);
      }
    });

    // Change cursor on hover
    map.on('mouseenter', 'earthquake-circles', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'earthquake-circles', () => {
      map.getCanvas().style.cursor = '';
    });
  };

  const updateEarthquakeMarkers = (data: EarthquakeFeatureCollection) => {
    if (!map || !map.getSource('earthquakes')) return;

    const source = map.getSource('earthquakes');
    source.setData(data);
  };

  // Expose map instance for external use
  export const getMap = () => map;
</script>

<div class="relative w-full h-full">
  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading map...</p>
      </div>
    </div>
  {:else if error}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
      <div class="text-center">
        <p class="text-red-600 mb-4">{error}</p>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          on:click={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  {/if}
  
  <MapLibre 
    center={[0, 0]}
    zoom={2}
    class="map-container"
    standardControls
    style="https://demotiles.maplibre.org/style.json"
    on:load={handleMapLoad}
    on:error={handleMapError}
  />
</div>

<style>
  :global(.map-container) {
    width: 100%;
    height: 100%;
  }
</style>
