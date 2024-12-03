<script lang="ts">
	import { DBWorkerService } from "$lib/db/worker/service";
	import type { DBInfo } from "$lib/db/worker/types";
	import { onMount } from "svelte";

	let dbWorkerService = DBWorkerService.getInstance();

	let availableDBs: DBInfo[] = $state([]);
	let loading: boolean = $state(true);

	const getAvailableDBs = () => dbWorkerService.sendMessage({ command: 'GET_AVAILABLE_DBS' });

	const unsubscribe = dbWorkerService.responses.subscribe(response => {
		loading = response.status === 'LOADING' && response.command === 'GET_AVAILABLE_DBS'
		if (response.status === 'SUCCESS' && response.command === 'GET_AVAILABLE_DBS') {
			loading = false;
			availableDBs = response.data.availableDBs;
		} else if (response.status === 'ERROR' && response.command === 'GET_AVAILABLE_DBS') {
			console.error(response.data)
		}
	});

	onMount(() => {
		getAvailableDBs()
	});


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
					<li>{db.name}</li>
				{/each}
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
