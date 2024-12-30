<script lang="ts">
	import { DBWorkerService } from '$lib/db/worker/service';
	import type { DBEngine } from '$lib/db/worker/types';

	let dbWorkerService = DBWorkerService.getInstance();

	let engine: DBEngine | undefined = $state(undefined);
	let dbName: string = $state('');
	let persistent: boolean = $state(false);

	let loading: boolean = $state(true);
	let disabled: boolean = $state(false);
	let message: string = $state('');

	const createDB = () => {
		if (dbName.length === 0) {
			message = 'Invalid Database Name';
			return;
		}

		if (!engine) {
			message = 'Invalid Database Engine';
			return;
		}

		message = `Creating a ${persistent ? 'Persistent' : 'In-Memory'} ${engine.toUpperCase()} DB called ${dbName}`;
		dbWorkerService.sendMessage({ command: 'CREATE_DB', args: { dbName, engine, persistent } });
		disabled = true;
	};

	const unsubscribe = dbWorkerService.responses.subscribe((response) => {
		engine = undefined;
		dbName = '';
		persistent = false;
		disabled = false;
		loading = response.status === 'LOADING' && response.command === 'CREATE_DB';

		if (response.status === 'SUCCESS' && response.command === 'CREATE_DB') {
			loading = false;
			message = 'Created DB: ' + response.data.dbName;
		} else if (response.status === 'ERROR' && response.command === 'CREATE_DB') {
			console.error(response.data);
			message = response.data.message + ' ' + (response.data.cause && response.data.cause);
		}
	});

	() => unsubscribe();
</script>

{#if loading}
	<p>Loading Active DBs</p>
{:else}
	<div>
		<h2 class="text-lg font-semibold">Create Database</h2>
		<form onsubmit={createDB} class="mt-4 space-y-4">
			<div>
				<label for="dbName" class="block text-sm font-medium text-gray-700">Database Name</label>
				<input
					type="text"
					id="dbName"
					bind:value={dbName}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
					placeholder="Enter database name"
				/>
			</div>
			<div>
				<label for="engine" class="block text-sm font-medium text-gray-700">Database Engine</label>
				<select
					id="engine"
					bind:value={engine}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
				>
					<option value="" disabled selected>Select a database engine</option>
					<option value="pgsql">PostgreSQL</option>
					<option value="sqlite">SQLite</option>
				</select>
			</div>
			<div class="flex items-center">
				<input
					type="checkbox"
					id="persistent"
					bind:checked={persistent}
					class="h-4 w-4 rounded border-gray-300 text-indigo-600"
				/>
				<label for="persistent" class="ml-2 block text-sm text-gray-700">Persistent</label>
			</div>
			<button
				type="submit"
				class="w-full rounded-lg bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900 disabled:bg-gray-700"
				{disabled}
			>
				Create DB
			</button>
		</form>

		<p class="mt-4">Message: {message}</p>
	</div>
{/if}
