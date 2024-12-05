<script lang="ts">
	import { PostgreSQL } from '$lib/db/engines/pgsql';
	import { onMount } from 'svelte';
	import CodeBlock from '../Blocks/CodeBlock.svelte';

	let db: PostgreSQL;
	let query = $state('');
	let result = $state('');

	onMount(() => {
		db = new PostgreSQL('PGSQL', { persistent: false });
	});

	const init = async () => {
		try {
			await db.init();
			result += '>> Successfully created DB\n';
		} catch (error) {
			result += (error instanceof Error ? error.message : 'Failed to initialize database') + '\n';
		}
	};

	const execQuery = async () => {
		const results = await db.exec(query);

		if (results.error) {
			result += `>> Error: ${JSON.stringify(results.error)}\n`;
		} else if (results.data) {
			result += `>> ${JSON.stringify(results.data)} (Took: ${results.elapsed} ms)\n`;
		}
	};

	const loadChinook = async () => {
		query = await fetch('chinook.txt')
			.then((response) => response.text())
			.catch(() => (result += 'Unable to fetch Chinook Query.'));
	};

	const close = async () => {
		await db.close();
		result += '>> Successfully closed DB\n';
	};
</script>

<div class="rounded-xl border-4 border-black p-10 shadow-xl">
	<h2 class="text-center text-2xl">PostgreSQL Database</h2>

	<div class="flex flex-col">
		<label for="query">Input:</label>
		<CodeBlock type="psql" bind:content={query} />
	</div>
	<div class="mt-8">
		<p>Result:</p>
		<div class="h-36 {result.length !== 0 ? 'overflow-y-scroll' : ''} whitespace-pre-wrap">
			{result}
		</div>
	</div>

	<div class="mt-10">
		<p>Database Settings</p>
		<div class="flex items-center justify-center gap-10">
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => init()}
			>
				Connect to DB
			</button>
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => loadChinook()}
			>
				Load Chinook
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
