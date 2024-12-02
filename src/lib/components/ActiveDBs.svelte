<script lang="ts">
	import { DBWorkerService } from "$lib/db/worker/service";
	import { onMount } from "svelte";

	let dbWorkerService = DBWorkerService.getInstance();

	let activeDBs: string[] = $state([]);
	let loading: boolean = $state(true);

	const getActiveDBs = () => dbWorkerService.sendMessage({ command: 'GET_ACTIVE_DBS' });

	const unsubscribe = dbWorkerService.responses.subscribe(response => {
		loading = response.status === 'LOADING' && response.command === 'GET_ACTIVE_DBS'
		if (response.status === 'SUCCESS' && response.command === 'GET_ACTIVE_DBS') {
			loading = false;
			activeDBs = response.data.activeDBs;
		} else if (response.status === 'ERROR' && response.command === 'GET_ACTIVE_DBS') {
			console.error(response.data)
		}
	});

	onMount(() => {
		getActiveDBs()
	});


	() => unsubscribe();
</script>

{#if loading}
	<p>Loading Active DBs</p>
{:else}
	<div>
		<h2 class="text-lg font-semibold">Active Databases</h2>
		<ul class="my-4 ml-4 list-disc">
			{#if activeDBs.length}
				{#each activeDBs as db}
					<li>{db}</li>
				{/each}
			{/if}
		</ul>
		<button
			class="w-full rounded bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
			onclick={getActiveDBs}
		>
			Get Active DBs
		</button>
	</div>
{/if}
