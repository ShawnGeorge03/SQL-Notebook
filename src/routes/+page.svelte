<script lang="ts">
	import { DBWorkerService } from '$lib/db/worker/service';
	import type { DBWorkerResponse } from '$lib/db/worker/types';

	import { onMount } from 'svelte';

	let loading: boolean = $state(true);

	let dbWorkerService: DBWorkerService;

	onMount(() => {
		try {
			dbWorkerService = DBWorkerService.getInstance();

			const unsubscribe = dbWorkerService.responses.subscribe((response: DBWorkerResponse) => {
				if (response.status === 'INITIALIZING') {
					loading = true;
				} else if (response.status === 'INITIALIZED') {
					loading = false;
				}
			});

			return () => {
				unsubscribe();
				dbWorkerService.disconnect();
			};
		} catch (e) {
			console.error(e instanceof Error ? e.message : 'Failed to start DB Worker!');
		}
	});
</script>

<div class="container mx-auto">
	{#if loading}
		<p>Loading Notebook</p>
	{:else}
		<h1 class="mb-6 text-center text-2xl font-bold">Database Manager</h1>
	{/if}
</div>