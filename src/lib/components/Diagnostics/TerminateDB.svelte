<script lang="ts">
	import { DBWorkerService } from '$lib/db/worker/service';
	import type { DBInfo } from '$lib/db/worker/types';
	import { onMount } from 'svelte';

	let dbWorkerService = DBWorkerService.getInstance();

	let availableDBs: DBInfo[] = $state([]);
	let dbName: string = $state('');

	let loading: boolean = $state(true);
	let disabled: boolean = $state(false);
	let message: string = $state('');

	const terminateDB = () => {
		if (dbName.length === 0) {
			message = 'Invalid Database Name';
			return;
		}

		message = `Terminating ${dbName} Database`;
		dbWorkerService.sendMessage({ command: 'DROP_DB', args: { dbName } });
		disabled = true;
	};

	const unsubscribe = dbWorkerService.responses.subscribe((response) => {
		dbName = '';
		disabled = false;
		loading = response.status === 'LOADING' && response.command === 'DROP_DB';

		if (response.status === 'SUCCESS' && response.command === 'GET_AVAILABLE_DBS') {
			loading = false;
			availableDBs = response.data.availableDBs;
		} else if (response.status === 'SUCCESS' && response.command === 'DROP_DB') {
			loading = false;
			message = 'Terminated DB: ' + response.data.dbName;
		} else if (response.status === 'ERROR' && response.command === 'DROP_DB') {
			console.error(response.data);
			message = response.data.message + ' ' + (response.data.cause && response.data.cause);
		}
	});

	onMount(() => {
		dbWorkerService.sendMessage({ command: 'GET_ACTIVE_DBS' });
	});

	() => unsubscribe();
</script>

{#if loading}
	<p>Loading Active DBs</p>
{:else}
	<div>
		<h2 class="text-lg font-semibold">Terminate Database</h2>
		<form onsubmit={terminateDB} class="mt-4 space-y-4">
			<div>
				<label for="engine" class="block text-sm font-medium text-gray-700">Database</label>
				<select
					id="engine"
					bind:value={dbName}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
					{disabled}
				>
					<option value="" disabled selected>Select a database</option>
					{#if availableDBs.length}
						{#each availableDBs as db}
							<option value={db.name}>{db.name}</option>
						{/each}
					{/if}
				</select>
			</div>
			<button
				type="submit"
				class="w-full rounded-lg bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900 disabled:bg-gray-700"
				{disabled}
			>
				Terminate DB
			</button>
		</form>

		<p class="mt-4">Message: {message}</p>
	</div>
{/if}
