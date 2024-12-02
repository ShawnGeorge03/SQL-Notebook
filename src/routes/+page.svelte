<script lang="ts">
	import ActiveDBs from '$lib/components/ActiveDBs.svelte';
	import AvailableDBs from '$lib/components/AvailableDBs.svelte';
	import CreateDB from '$lib/components/CreateDB.svelte';
	import LoadDB from '$lib/components/LoadDB.svelte';
	import { DBWorkerService } from '$lib/db/worker/service';

	import { onMount } from 'svelte';

	let loading: boolean = $state(true);

	let dbWorkerService: DBWorkerService;

	onMount(() => {
		try {
			dbWorkerService = DBWorkerService.getInstance();

			const unsubscribe = dbWorkerService.responses.subscribe(response => {
				loading = response.status === 'INITIALIZING'
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

		<div class="grid grid-cols-2 gap-4">
			<AvailableDBs />
			<ActiveDBs />
			<CreateDB />
			<LoadDB />
		</div>
	{/if}
</div>