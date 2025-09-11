<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content="Real-time earthquake monitoring and visualization platform" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>QuakeMap - Real-time Earthquake Monitoring</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	{@render children?.()}
</div>
