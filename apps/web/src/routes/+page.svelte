<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
	<div class="container mx-auto px-4 py-16">
		<!-- Hero Section -->
		<div class="text-center mb-16">
			<h1 class="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
				QuakeMap
			</h1>
			<p class="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
				Real-time earthquake monitoring and visualization platform built with SvelteKit and shadcn-svelte
			</p>
			<div class="flex gap-4 justify-center">
				<a href="/map">
					<Button size="lg" class="px-8">
						View Earthquake Map
					</Button>
				</a>
				<Button variant="outline" size="lg" class="px-8">
					Learn More
				</Button>
			</div>
		</div>

		<!-- Features Grid -->
		<div class="grid md:grid-cols-3 gap-8 mb-16">
			<Card class="p-6 hover:shadow-lg transition-shadow">
				<CardHeader>
					<CardTitle class="text-xl">Real-time Data</CardTitle>
					<CardDescription>
						Live earthquake data from around the world
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-slate-600 dark:text-slate-400">
						Get instant updates on seismic activity with our real-time monitoring system.
					</p>
				</CardContent>
			</Card>

			<Card class="p-6 hover:shadow-lg transition-shadow">
				<CardHeader>
					<CardTitle class="text-xl">Interactive Maps</CardTitle>
					<CardDescription>
						Visualize earthquakes on interactive maps
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-slate-600 dark:text-slate-400">
						Explore earthquake locations, magnitudes, and patterns with our interactive mapping tools.
					</p>
				</CardContent>
			</Card>

			<Card class="p-6 hover:shadow-lg transition-shadow">
				<CardHeader>
					<CardTitle class="text-xl">Modern UI</CardTitle>
					<CardDescription>
						Built with shadcn-svelte components
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-slate-600 dark:text-slate-400">
						Beautiful, accessible, and responsive interface powered by modern design systems.
					</p>
				</CardContent>
			</Card>
		</div>

		<!-- Tech Stack -->
		<div class="text-center">
			<h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
				Built with Modern Technologies
			</h2>
			<div class="flex flex-wrap justify-center gap-4">
				<Button variant="secondary" class="px-6">SvelteKit</Button>
				<Button variant="secondary" class="px-6">TypeScript</Button>
				<Button variant="secondary" class="px-6">Tailwind CSS</Button>
				<Button variant="secondary" class="px-6">shadcn-svelte</Button>
			</div>
		</div>
	</div>
</div>
