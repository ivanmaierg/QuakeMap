# Earthquake Map Implementation

This document describes the earthquake map implementation using Svelte Maplibre with Marker components.

## Features

- **Interactive Map**: Built with Svelte Maplibre and MapLibre GL
- **Custom Markers**: Uses `svelte-maplibre/Marker.svelte` for earthquake visualization
- **Real-time Data**: Fetches earthquake data from the API
- **Visual Indicators**: Color-coded markers based on magnitude
- **Projection Toggle**: Switch between globe and mercator projections
- **Click Details**: Click on earthquake markers to see detailed information
- **Popup Integration**: Uses `svelte-maplibre/Popup.svelte` for earthquake details
- **Advanced Filtering**: Filter earthquakes by magnitude, date, and other criteria
- **Responsive Design**: Works on desktop and mobile devices

## Components

### EarthquakeMap.svelte
The main map component that:
- Renders the MapLibre map with `MapLibre.svelte`
- Uses `Marker.svelte` components for each earthquake
- Integrates `Popup.svelte` for earthquake details
- Provides interactive controls (projection toggle, refresh)
- Shows loading states and error handling
- Displays selected earthquake information

### EarthquakeFilters.svelte
Advanced filtering component that:
- Provides quick filter buttons (Magnitude 4+, 5+, 6+, 7+)
- Offers advanced filters (magnitude range, date range, result limit)
- Shows active filter summary
- Integrates with the earthquake store

### Earthquake Store (earthquakes.ts)
Manages earthquake data state:
- Fetches data from API with filtering support
- Handles loading and error states
- Provides reactive data updates
- TypeScript interfaces for type safety

## Implementation Approach

### Marker-Based Visualization
Instead of using map layers, the implementation uses individual `Marker` components:

```svelte
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
        <!-- Earthquake details -->
      </div>
    </Popup>
  </Marker>
{/each}
```

### Dynamic Styling
Markers are styled based on earthquake magnitude:

```typescript
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
```

## API Integration

The map fetches data from `/api/earthquakes` which proxies to the backend API at `http://localhost:8787/earthquakes`.

### Filtering Support
The API supports various query parameters:
- `magnitude`: Minimum magnitude filter
- `startDate`: Start date for filtering
- `endDate`: End date for filtering
- `limit`: Maximum number of results

## Map Styling

- **Base Style**: Uses CartoDB Positron style for clean visualization
- **Marker Colors**: Color-coded by magnitude:
  - Green (1.0-2.9): Smallest markers
  - Green (3.0-3.9): Slightly larger
  - Yellow (4.0-4.9): Medium size
  - Orange (5.0-5.9): Larger markers
  - Red (6.0-6.9): Large markers
  - Dark Red (7.0+): Largest markers
- **Marker Sizes**: Scale from 20px to 40px based on magnitude
- **Interactive Effects**: Hover animations and click interactions
- **White Borders**: 2px white border for better visibility

## Usage

1. Navigate to `/map` to view the earthquake map
2. Use mouse wheel to zoom in/out
3. Drag to pan around the map
4. Click on earthquake markers for popup details
5. Use sidebar filters to filter earthquakes
6. Toggle projection between globe and mercator
7. Refresh data to get latest earthquakes
8. Click "Toggle Projection" to switch between globe and mercator views

## Controls Layout

- **Top Right**: Map controls (Toggle Projection, Refresh Data, Earthquake Stats)
- **Top Left**: Loading indicators and error messages
- **Right Sidebar**: Filters, legend, statistics, and instructions
- **Bottom**: Selected earthquake details (when an earthquake is clicked)

## Dependencies

- `svelte-maplibre`: Svelte wrapper for MapLibre GL
- `maplibre-gl`: Core mapping library
- MapLibre GL CSS: Required for styling

## Development

To run the development server:

```bash
# Start the web app
pnpm dev --filter=web

# Start the API server (in another terminal)
pnpm dev --filter=api
```

The web app will be available at `http://localhost:5173` and the API at `http://localhost:8787`.

## Key Advantages of Marker Approach

1. **Better Performance**: Individual markers are more efficient than map layers
2. **Easier Styling**: CSS classes can be applied directly to markers
3. **Better Interactions**: Native click handlers and hover effects
4. **Simpler Code**: No complex layer management
5. **Responsive Design**: Markers scale naturally with map zoom
6. **Accessibility**: Better screen reader support
