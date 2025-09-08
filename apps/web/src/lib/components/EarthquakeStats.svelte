<script lang="ts">
  import { earthquakeStats, earthquakeCount, maxMagnitude, minMagnitude, avgMagnitude, lastUpdate } from '../stores/earthquakes';
  import { Card } from '@quake-map/ui';

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatMagnitude = (magnitude: number | null): string => {
    if (magnitude === null) return '-';
    return magnitude.toFixed(1);
  };
</script>

<Card>
  <h2 class="text-lg font-semibold mb-4">Earthquake Statistics</h2>
  <div class="space-y-3">
    <div class="flex justify-between items-center">
      <span class="text-gray-600">Total Earthquakes:</span>
      <span class="font-medium text-lg">{$earthquakeCount}</span>
    </div>
    
    <div class="flex justify-between items-center">
      <span class="text-gray-600">Max Magnitude:</span>
      <span class="font-medium text-red-600">{$maxMagnitude ? formatMagnitude($maxMagnitude) : '-'}</span>
    </div>
    
    <div class="flex justify-between items-center">
      <span class="text-gray-600">Min Magnitude:</span>
      <span class="font-medium text-green-600">{$minMagnitude ? formatMagnitude($minMagnitude) : '-'}</span>
    </div>
    
    <div class="flex justify-between items-center">
      <span class="text-gray-600">Avg Magnitude:</span>
      <span class="font-medium text-blue-600">{$avgMagnitude ? formatMagnitude($avgMagnitude) : '-'}</span>
    </div>
    
    <div class="flex justify-between items-center">
      <span class="text-gray-600">Last Update:</span>
      <span class="font-medium text-sm">{$lastUpdate ? formatDate($lastUpdate) : '-'}</span>
    </div>
  </div>
</Card>
