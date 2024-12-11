<script lang="ts">
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	import Editor from '$lib/components/Blocks/Block/index.svelte';
	import type { QueryResult } from '$lib/db/engines/types';
	import { DBWorkerService } from '$lib/db/worker/service';
	import type { DBEngine, DBInfo } from '$lib/db/worker/types';
	import { PostgreSQL, sql, SQLite, StandardSQL } from '@codemirror/lang-sql';

	import DuckDBIcon from '$lib/assets/duckdb.svg?raw';
	import PostgreSQLIcon from '$lib/assets/postgresql.svg?raw';
	import SpinnerIcon from '$lib/assets/spinner.svg?raw';
	import SQLiteIcon from '$lib/assets/sqlite.svg?raw';

	interface CodeBlockProps {
		id: string;
		class?: string;
		dbName?: string;
		engine?: DBEngine;
		query: string;
		result: QueryResult;
		ondelete: VoidFunction;
	}

	let {
		id,
		class: className,
		query = $bindable(''),
		result = $bindable({}),
		dbName = $bindable(''),
		engine = $bindable(),
		ondelete = $bindable<VoidFunction>()
	}: CodeBlockProps = $props();

	let customExtensions = [
		sql({
			upperCaseKeywords: true,
			dialect: engine === 'pgsql' ? PostgreSQL : engine === 'sqlite' ? SQLite : StandardSQL
		})
	];

	let isOpen = $state(false);

	let dbWorkerService = DBWorkerService.getInstance();
	let activeDBs: DBInfo[] = $state([]);
	let loading: boolean = $state(true);
	const unsubscribe = dbWorkerService.responses.subscribe((response) => {
		loading = response.status === 'LOADING' && response.command === 'GET_ACTIVE_DBS';
		if (response.status === 'SUCCESS') {
			if (response.command === 'GET_ACTIVE_DBS') {
				loading = false;
				activeDBs = response.data.activeDBs;
			} else if (response.command === 'EXEC_QUERY' && response.data.id === id) {
				result = {
					data: response.data.data,
					error: response.data.error,
					elapsed: response.data.elapsed
				};
			}
		} else if (response.status === 'ERROR' && response.command === 'GET_ACTIVE_DBS') {
			console.error(response.data);
		}
	});

	onMount(() => {
		dbWorkerService.sendMessage({ command: 'GET_ACTIVE_DBS' });
	});

	() => unsubscribe();
</script>

<div class="rounded-sm border border-gray-200 bg-white">
	<div class="rounded-s-sm border border-gray-200 bg-white px-4 py-2">
		<div class="flex gap-4">
			{#if loading}
				<button
					disabled
					type="button"
					class="inline-flex items-center rounded-lg border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
				>
					<span class="me-3 inline h-4 w-4 animate-spin text-white">{@html SpinnerIcon}</span>
					Loading...
				</button>
			{:else}
				<button
					type="button"
					disabled={activeDBs.length === 0}
					class="inline-flex items-center rounded-lg border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
					onclick={() => (isOpen = !isOpen)}
				>
					{#if engine === 'pgsql'}
						<span class="h-8 w-10" aria-hidden="true">{@html PostgreSQLIcon}</span>
					{:else if engine === 'sqlite'}
						<span class="h-8 w-10" aria-hidden="true">{@html SQLiteIcon}</span>
					{:else if engine === 'duckdb'}
						<span class="h-8 w-10" aria-hidden="true">{@html DuckDBIcon}</span>
					{/if}
					{dbName}
					<span class="ml-2 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}">
						▼
					</span>
				</button>
			{/if}

			<button
				class="ml-auto cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => {
					dbWorkerService.sendMessage({ command: 'EXEC_QUERY', args: { id, dbName, query } });
					result = {};
				}}>Run</button
			>
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => ondelete()}>Delete</button
			>
		</div>

		{#if isOpen}
			<ul
				transition:slide={{ duration: 300, easing: quintOut }}
				class="absolute z-10 mt-2 w-fit overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
			>
				{#each activeDBs as database}
					<button
						class="flex cursor-pointer items-center space-x-2 px-4 py-2 transition-colors duration-200 hover:bg-gray-100 hover:text-blue-600"
						onclick={() => {
							dbName = database.name;
							engine = database.engine;
						}}
					>
						{#if database.engine === 'pgsql'}
							<span class="h-8 w-10" aria-hidden="true">{@html PostgreSQLIcon}</span>
						{:else if database.engine === 'sqlite'}
							<span class="h-8 w-10" aria-hidden="true">{@html SQLiteIcon}</span>
						{:else if database.engine === 'duckdb'}
							<span class="h-8 w-10" aria-hidden="true">{@html DuckDBIcon}</span>
						{/if}
						<span class="flex-1 text-sm font-medium text-gray-900">{database.name}</span>
					</button>
				{/each}
			</ul>
		{/if}
	</div>
	<!-- The additional attributes of autocomplete, autocorrect, autocapitalize, and spellcheck
are to ensure that Grammarly and others like it would not cause issue to this component
Source: https://stackoverflow.com/questions/254712/disable-spell-checking-on-html-textfields   -->
	<Editor
		autocomplete="off"
		autocorrect="off"
		autocapitalize="off"
		spellcheck="false"
		class={className}
		bind:content={query}
		{customExtensions}
	/>

	<div class={!result ? 'hidden' : ''}>
		{JSON.stringify(result)}
	</div>
</div>
