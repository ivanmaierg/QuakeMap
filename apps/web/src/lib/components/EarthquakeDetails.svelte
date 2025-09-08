<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from '@quake-map/ui'; 

  export let earthquake: any = null;
  export let isOpen = false;

  const dispatch = createEventDispatcher();

  const close = () => {
    dispatch('close');
  };

  const formatDate = (timestamp: number): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(new Date(timestamp));
  };

  const formatMagnitude = (magnitude: number): string => {
    return magnitude.toFixed(1);
  };

  const getMagnitudeColor = (magnitude: number): string => {
    if (magnitude >= 7) return 'text-red-600';
    if (magnitude >= 6) return 'text-orange-600';
    if (magnitude >= 5) return 'text-amber-600';
    if (magnitude >= 4) return 'text-yellow-600';
    if (magnitude >= 3) return 'text-lime-600';
    return 'text-green-600';
  };

  const getMagnitudeBg = (magnitude: number): string => {
    if (magnitude >= 7) return 'bg-red-100';
    if (magnitude >= 6) return 'bg-orange-100';
    if (magnitude >= 5) return 'bg-amber-100';
    if (magnitude >= 4) return 'bg-yellow-100';
    if (magnitude >= 3) return 'bg-lime-100';
    return 'bg-green-100';
  };
</script>

{#if isOpen && earthquake}
  <!-- Modal Backdrop -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    on:click={close}
    on:keydown={(e) => e.key === 'Escape' && close()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Modal Content -->
    <div 
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      role="document"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Earthquake Details</h2>
        <button
          on:click={close}
          class="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Title and Magnitude -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {earthquake.title || 'Earthquake Event'}
            </h3>
            <p class="text-gray-600">
              {earthquake.place || 'Location not specified'}
            </p>
          </div>
          <div class="ml-4">
            <div class="flex items-center space-x-2">
              <div class="text-3xl font-bold {getMagnitudeColor(earthquake.magnitude)}">
                {formatMagnitude(earthquake.magnitude)}
              </div>
              <div class="text-sm text-gray-500">Mw</div>
            </div>
          </div>
        </div>

        <!-- Key Information Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div>
              <div class="text-sm font-medium text-gray-500">Time</div>
              <p class="text-gray-900">{formatDate(earthquake.time)}</p>
            </div>
            
            {#if earthquake.updated}
              <div>
                <div class="text-sm font-medium text-gray-500">Last Updated</div>
                <p class="text-gray-900">{formatDate(earthquake.updated)}</p>
              </div>
            {/if}

            <div>
              <div class="text-sm font-medium text-gray-500">Coordinates</div>
              <p class="text-gray-900">
                {earthquake.longitude?.toFixed(4)}, {earthquake.latitude?.toFixed(4)}
              </p>
            </div>
          </div>

          <div class="space-y-3">
            {#if earthquake.depth}
              <div>
                <div class="text-sm font-medium text-gray-500">Depth</div>
                <p class="text-gray-900">{earthquake.depth.toFixed(1)} km</p>
              </div>
            {/if}

            {#if earthquake.felt}
              <div>
                <div class="text-sm font-medium text-gray-500">Felt Reports</div>
                <p class="text-gray-900">{earthquake.felt}</p>
              </div>
            {/if}

            {#if earthquake.tsunami}
              <div>
                <div class="text-sm font-medium text-gray-500">Tsunami</div>
                <p class="text-gray-900">{earthquake.tsunami > 0 ? 'Yes' : 'No'}</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Additional Details -->
        {#if earthquake.alert || earthquake.status}
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#if earthquake.alert}
                <div>
                  <div class="text-sm font-medium text-gray-500">Alert Level</div>
                  <p class="text-gray-900">{earthquake.alert}</p>
                </div>
              {/if}
              
              {#if earthquake.status}
                <div>
                  <div class="text-sm font-medium text-gray-500">Status</div>
                  <p class="text-gray-900">{earthquake.status}</p>
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Links -->
        {#if earthquake.url}
          <div class="border-t border-gray-200 pt-4">
            <a 
              href={earthquake.url} 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on USGS
            </a>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="flex justify-end p-6 border-t border-gray-200">
        <Button variant="outline" on:click={close}>
          Close
        </Button>
      </div>
    </div>
  </div>
{/if}
