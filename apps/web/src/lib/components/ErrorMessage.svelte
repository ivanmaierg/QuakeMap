<script lang="ts">
	interface Props {
		error: string;
		position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
		onDismiss?: () => void;
	}

	const { 
		error, 
		position = 'top-left',
		onDismiss
	}: Props = $props();

	const positionClasses = {
		'top-left': 'top-4 left-4',
		'top-right': 'top-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
	};
</script>

<div class="absolute {positionClasses[position]} z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
	<div class="flex items-start justify-between">
		<p class="text-sm">Error: {error}</p>
		{#if onDismiss}
			<button
				class="ml-2 text-red-500 hover:text-red-700"
				onclick={onDismiss}
				type="button"
				aria-label="Dismiss error"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
				</svg>
			</button>
		{/if}
	</div>
</div>
