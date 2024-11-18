<script lang="ts">
	import editorConfig, { updateHighlightTrailingWhitespace, updateHighlightWhitespace, updateLineNumbers } from '$lib/components/Blocks/Block/store';
	import CodeBlock from '$lib/components/Blocks/CodeBlock.svelte';
	import { DatabaseContext } from '$lib/db';
	import { PostgreSQL } from '$lib/db/psql';
	import type { PGlite } from '@electric-sql/pglite';
	import { onMount } from 'svelte';

	let db: DatabaseContext<PGlite>;

	let query = $state('');
	let result = $state('');

	const initDB = async () => {
		await db.init();
		result += '>> Successfully created DB\n';
	};

	const loadChinook = async () => {
		query = await fetch('chinook.txt').then((response) => response.text());
	};

	const runQuery = async () => {
		const results = await db.exec(query);

		if (results.error) result += `>> Error: ${JSON.stringify(results.error)}\n`;
		else if (results.data)
			result += `>> ${JSON.stringify(results.data)} (Took: ${results.elapsed} ms)\n`;
	};

	const close = async () => {
		await db.close();
		result += '>> Successfully closed DB\n';
		console.log(result);
		query = '';
	};

	onMount(async () => {
		try {
			db = new DatabaseContext();
			db.setStrategy(new PostgreSQL('SvelteDB', {}));

			loadChinook();
		} catch (e) {
			result += (e instanceof Error ? e.message : 'Failed to initialize database') + '\n';
		}
	});
</script>

<div class="m-36 min-h-screen">
	<div class="flex flex-col">
		<label for="query">Input:</label>
		<CodeBlock type="psql" bind:content={query} />
	</div>
	<div class="mt-8">
		<p>Result:</p>
		<div class="h-36 overflow-y-scroll whitespace-pre-wrap bg-gray-300">{result}</div>
	</div>

	<div class="mt-10">
		<p>Database Settings</p>
		<div class="flex items-center justify-center gap-10">
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => initDB()}
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
				onclick={() => runQuery()}
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

	<div class="mt-10">
		<p>Code Editor Settings</p>
		<div class="flex items-center justify-center gap-10">
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => updateLineNumbers()}
			>
				{$editorConfig.lineNumbers ? 'Remove line numbers' : 'Add line numbers'}
			</button>
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => updateHighlightWhitespace()}
			>
				{$editorConfig.highlightWhitespace ? 'Unhighlight Whitespace' : 'Highlight Whitespace'}
			</button>
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => updateHighlightTrailingWhitespace()}
			>
				{$editorConfig.highlightTrailingWhitespace
					? 'Unhighlight Trailing Whitespace'
					: 'Highlight Trailing Whitespace'}
			</button>
		</div>
	</div>
</div>
