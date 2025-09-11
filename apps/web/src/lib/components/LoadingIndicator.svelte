<script lang="ts">
	interface Props {
		message?: string;
		position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
	}

	const { 
		message = 'Loading earthquakes...', 
		position = 'top-left' 
	}: Props = $props();

	const positionClasses = {
		'top-left': 'top-4 left-4',
		'top-right': 'top-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
	};
</script>

<div class="absolute {positionClasses[position]} z-10 bg-white p-3 rounded shadow">
	<div class="flex items-center gap-2">
		<div 
			class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
			role="status"
			aria-label="Loading"
		></div>
		<span class="text-sm">{message}</span>
	</div>
</div>
