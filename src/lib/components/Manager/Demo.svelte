<script lang="ts">
	import { DBWorkerService } from '$lib/db/worker/service';
	import { DBEngine } from '$lib/db/worker/types';

	let dbWorkerService = DBWorkerService.getInstance();

	let loading: boolean = $state(true);
	let message: string = $state('');

	const createDemo = (engine: DBEngine) => {
		dbWorkerService.sendMessage({
			command: 'CREATE_DEMO',
			args: { engine }
		});
	};

	const unsubscribe = dbWorkerService.responses.subscribe((response) => {
		console.log(response);
		loading = response.status === 'LOADING' && response.command === 'CREATE_DEMO';

		if (response.status === 'SUCCESS' && response.command === 'CREATE_DEMO') {
			loading = false;
			message = `Created Sample Database: ${response.data.dbName}`;
		} else if (response.status === 'ERROR' && response.command === 'CREATE_DEMO') {
			console.error(response.data);
			message = response.data.message + ' ' + (response.data.cause && response.data.cause);
		}
	});

	() => unsubscribe();
</script>

{#if loading}
	<p>Loading Active DBs</p>
{:else}
	<div class="flex flex-col gap-4">
		<h2 class="text-lg font-semibold">Demo Databases</h2>

		<div class="flex gap-4">
			<button
				class="w-full rounded bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => createDemo(DBEngine.PGSQL)}>PostgreSQL - Chinook</button
			>
			<button
				class="w-full rounded bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => createDemo(DBEngine.SQLITE)}>SQLite - Chinook</button
			>
		</div>
	</div>
{/if}
