<script lang="ts">
	import { dbWorkerMessagesStore, dbWorkerResponsesStore } from '$lib/db/worker/store';

	let availableDBs: string[] = $state([]);
	let loading: boolean = $state(true);

	const unsubscribe = dbWorkerResponsesStore.subscribe((event) => {
		if (event.status === 'LOADING' && event.command === 'GET_AVAILABLE_DBS') {
			loading = true;
		} else if (event.status === 'READY') {
			loading = false;
		} else if (event.status === 'SUCCESS' && event.command === 'GET_AVAILABLE_DBS') {
			availableDBs = event.response.availableDBs;
		} else if (event.status === 'ERROR' && event.command === 'GET_AVAILABLE_DBS') {
			console.error(event.response);
		}
	});

	const getAvailableDBs = () => dbWorkerMessagesStore.set({ command: 'GET_AVAILABLE_DBS' });

	() => unsubscribe();
</script>

{#if loading}
	<p>Loading Available DBs</p>
{:else}
	<div>
		<h2 class="text-lg font-semibold">Available Databases</h2>
		<ul class="my-4 ml-4 list-disc">
			{#if availableDBs.length}
				{#each availableDBs as db}
					<li>{db}</li>
				{/each}
			{:else}
				<li>No active databases</li>
			{/if}
		</ul>
		<button
			class="w-full rounded bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
			onclick={getAvailableDBs}
		>
			Get Available DBs
		</button>
	</div>
{/if}
