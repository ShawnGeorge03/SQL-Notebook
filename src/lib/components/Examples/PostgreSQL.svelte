<script lang="ts">
	import { PostgreSQL } from '$lib/db/engines/pgsql';
	import { onMount } from 'svelte';
	import CodeBlock from '../Blocks/CodeBlock.svelte';

	const DBS = $state<Record<string, PostgreSQL>>({});
	let selectedDB = $state('');
	let query = $state('');
	let result = $state('');

	onMount(() => {
		DBS['A'] = new PostgreSQL('A', { persistent: false });
		DBS['B'] = new PostgreSQL('B', { persistent: false });
		DBS['C'] = new PostgreSQL('C', { persistent: false });
		selectedDB = 'A';
	});

	const init = async () => {
		try {
			await DBS[selectedDB].init();
			result += `>> Successfully created DB: ${selectedDB}\n`;
		} catch (error) {
			result += (error instanceof Error ? error.message : 'Failed to initialize database') + '\n';
		}
	};

	const execQuery = async () => {
		const results = await DBS[selectedDB].exec(query);

		if (results.error) {
			result += `>> Error: ${JSON.stringify(results.error)}\n`;
		} else if (results.data) {
			result += `>> ${JSON.stringify(results.data)} (Took: ${results.elapsed} ms)\n`;
		}
	};

	const loadSampleQuery = async () => {
		query = await fetch('chinook/pgsql.txt')
			.then((response) => response.text())
			.catch(() => (result += 'Unable to fetch Chinook Query.'));
	};

	const close = async () => {
		await DBS[selectedDB].close();
		delete DBS[selectedDB];
		result += `>> Successfully closed DB: ${selectedDB}\n`;
	};
</script>

<div class="flex flex-col gap-5 rounded-xl border-4 border-black p-10 shadow-xl">
	<h2 class="text-center text-2xl">PostgreSQL Database</h2>

	<div>
		<h3 class="pb-2 text-xl">Database</h3>
		<select
			bind:value={selectedDB}
			class="mt-1 block rounded-md border-gray-300 shadow-sm sm:text-sm"
		>
			{#each Object.keys(DBS) as dbName}
				<option value={dbName}>{dbName}</option>
			{/each}
		</select>
	</div>

	<div class="flex flex-col">
		<h3 class="pb-2 text-xl">Query</h3>
		<CodeBlock type="psql" bind:content={query} />
	</div>
	<div>
		<h3 class="pb-2 text-xl">Result</h3>
		<div
			class="h-36 {result.length !== 0
				? 'overflow-y-scroll'
				: ''} whitespace-pre-wrap rounded-sm border-2 border-black p-2 dark:border-white"
		>
			{result}
		</div>
	</div>

	<div class="mt-10">
		<h3 class="pb-2 text-xl">Database Settings</h3>
		<div class="flex items-center justify-center gap-10">
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => init()}
			>
				Connect to DB
			</button>
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => loadSampleQuery()}
			>
				Load Sample
			</button>
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => execQuery()}
			>
				Run Query
			</button>
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => close()}
			>
				Close DB
			</button>
		</div>
	</div>
</div>
