<script lang="ts">
  import { updateFilters, filters } from '../stores/earthquakes';
  import { Button } from '@quake-map/ui';

  let minMagnitude = 0;
  let maxMagnitude = 10;
  let timeRange = 'all';
  let limit = 1000;

  // Subscribe to current filters
  const unsubscribe = filters.subscribe((currentFilters) => {
    minMagnitude = currentFilters.minMagnitude || 0;
    maxMagnitude = currentFilters.maxMagnitude || 10;
    limit = currentFilters.limit || 1000;
  });

  const handleMagnitudeChange = async () => {
    await updateFilters({
      minMagnitude: minMagnitude > 0 ? minMagnitude : undefined,
      maxMagnitude: maxMagnitude < 10 ? maxMagnitude : undefined,
      limit
    });
  };

  const handleTimeRangeChange = async () => {
    const now = new Date();
    let startDate: string | undefined;
    
    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      default:
        startDate = undefined;
    }
    
    await updateFilters({ startDate });
  };

  const handleLimitChange = async () => {
    await updateFilters({ limit });
  };

  const clearFilters = async () => {
    minMagnitude = 0;
    maxMagnitude = 10;
    timeRange = 'all';
    limit = 1000;
    await updateFilters({});
  };
</script>

<div class="space-y-6">
  <!-- Magnitude Range -->
  <div>
    <div class="block text-sm font-medium text-gray-700 mb-2">
      Magnitude Range
    </div>
    <div class="space-y-3">
      <div class="flex items-center space-x-2">
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          bind:value={minMagnitude}
          on:input={handleMagnitudeChange}
          class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span class="text-sm text-gray-600 w-12">{minMagnitude.toFixed(1)}</span>
      </div>
      <div class="flex items-center space-x-2">
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          bind:value={maxMagnitude}
          on:input={handleMagnitudeChange}
          class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span class="text-sm text-gray-600 w-12">{maxMagnitude.toFixed(1)}</span>
      </div>
      <div class="text-xs text-gray-500">
        Min: {minMagnitude.toFixed(1)} - Max: {maxMagnitude.toFixed(1)}
      </div>
    </div>
  </div>

  <!-- Time Range -->
  <div>
    <div class="block text-sm font-medium text-gray-700 mb-2">
      Time Range
    </div>
    <select 
      bind:value={timeRange} 
      on:change={handleTimeRangeChange}
      class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="all">All time</option>
      <option value="24h">Last 24 hours</option>
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
    </select>
  </div>

  <!-- Limit -->
  <div>
    <div class="block text-sm font-medium text-gray-700 mb-2">
      Max Results
    </div>
    <select 
      bind:value={limit} 
      on:change={handleLimitChange}
      class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value={100}>100</option>
      <option value={500}>500</option>
      <option value={1000}>1000</option>
      <option value={5000}>5000</option>
    </select>
  </div>

  <!-- Clear Filters -->
  <div class="pt-4 border-t border-gray-200">
    <Button 
      variant="outline" 
      size="sm" 
      on:click={clearFilters}
      class="w-full"
    >
      Clear All Filters
    </Button>
  </div>
</div>
