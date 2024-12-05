<script lang="ts">
	import ActiveDBs from '$lib/components/Manager/ActiveDBs.svelte';
	import AvailableDBs from '$lib/components/Manager/AvailableDBs.svelte';
	import CloseDB from '$lib/components/Manager/CloseDB.svelte';
	import CreateDB from '$lib/components/Manager/CreateDB.svelte';
	import LoadDB from '$lib/components/Manager/LoadDB.svelte';
	import Notebook from '$lib/components/Notebook/Notebook.svelte';
	import { DBWorkerService } from '$lib/db/worker/service';

	import { onMount } from 'svelte';

	let loading: boolean = $state(true);

	let dbWorkerService: DBWorkerService;

	onMount(() => {
		try {
			dbWorkerService = DBWorkerService.getInstance();

			const unsubscribe = dbWorkerService.responses.subscribe((response) => {
				loading = response.status === 'INITIALIZING';
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

<div class="mx-56 flex flex-col">
	{#if loading}
		<p>Loading Notebook</p>
	{:else}
		<h1 class="mb-6 text-center text-2xl font-bold">Database Manager</h1>

		<div class="grid grid-cols-2 gap-4">
			<AvailableDBs />
			<ActiveDBs />
			<CreateDB />
			<LoadDB />
			<CloseDB />
		</div>

		<Notebook />
	{/if}
</div>
