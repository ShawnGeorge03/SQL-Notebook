<script lang="ts">
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	import { DBWorkerService } from '$lib/db/worker/service';
	import type { DBInfo } from '$lib/db/worker/types';
	import type { AddCell } from './type';

	import ChartIcon from '$lib/assets/add-chart.svg?raw';
	import AIIcon from '$lib/assets/ai.svg?raw';
	import DatabaseIcon from '$lib/assets/db/actions/load-db.svg?raw';
	import PostgreSQLIcon from '$lib/assets/db/engines/postgresql.svg?raw';
	import SQLiteIcon from '$lib/assets/db/engines/sqlite.svg?raw';
	import MarkdownIcon from '$lib/assets/markdown.svg?raw';
	import SpinnerIcon from '$lib/assets/spinner.svg?raw';

	let isOpen = $state(false);

	let { cellToAdd = $bindable<AddCell>(undefined) } = $props();

	let options = [
		{
			name: 'SQL',
			slug: 'sql',
			icon: DatabaseIcon
		},
		{
			name: 'Markdown',
			slug: 'markdown',
			icon: MarkdownIcon
		},
		{
			name: 'Chart',
			slug: 'chart',
			icon: ChartIcon
		},
		{
			name: 'Generate with AI',
			slug: 'ai',
			icon: AIIcon
		}
	];

	let dbWorkerService = DBWorkerService.getInstance();

	let activeDBs: DBInfo[] = $state([]);
	let loading: boolean = $state(true);

	const unsubscribe = dbWorkerService.responses.subscribe((response) => {
		loading = response.status === 'LOADING' && response.command === 'GET_ACTIVE_DBS';
		if (response.status === 'SUCCESS' && response.command === 'GET_ACTIVE_DBS') {
			activeDBs = response.data.activeDBs;
			loading = false;
		} else if (response.status === 'ERROR' && response.command === 'GET_ACTIVE_DBS') {
			console.error(response.data);
		}
	});

	onMount(() => {
		dbWorkerService.sendMessage({ command: 'GET_ACTIVE_DBS' });
	});

	() => unsubscribe();
</script>

<div class="relative inline-flex w-fit shadow-md" role="group">
	{#each options as option, i}
		{#if option.name === 'SQL'}
			{#if loading}
				<button
					disabled
					type="button"
					class="inline-flex items-center rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
				>
					<span class="me-3 inline h-4 w-4 animate-spin text-white">{@html SpinnerIcon}</span>
					Loading...
				</button>
			{:else}
				<button
					type="button"
					disabled={activeDBs.length === 0}
					class="inline-flex items-center rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
					onclick={() => (isOpen = !isOpen)}
				>
					{@html option.icon}
					{option.name}
					<span class="ml-2 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}">
						▼
					</span>
				</button>
			{/if}

			{#if isOpen}
				<ul
					transition:slide={{ duration: 300, easing: quintOut }}
					class="absolute left-0 top-full z-10 mt-2 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
				>
					{#each activeDBs as database}
						<button
							class="flex cursor-pointer items-center space-x-2 px-4 py-2 transition-colors duration-200 hover:bg-gray-100 hover:text-blue-600"
							onclick={() => {
								cellToAdd = { cell: 'sql', dbName: database.name, engine: database.engine };
								isOpen = false;
							}}
						>
							{#if database.engine === 'pgsql'}
								<span class="h-8 w-10" aria-hidden="true">{@html PostgreSQLIcon}</span>
							{:else if database.engine === 'sqlite'}
								<span class="h-8 w-10" aria-hidden="true">{@html SQLiteIcon}</span>
							{/if}
							<span class="flex-1 text-sm font-medium text-gray-900">{database.name}</span>
						</button>
					{/each}
				</ul>
			{/if}
		{:else}
			<button
				type="button"
				class="inline-flex items-center {i === options.length - 1 &&
					'rounded-e-lg'} border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
				onclick={() => (cellToAdd = { cell: option.slug })}
			>
				{@html option.icon}
				{option.name}
			</button>
		{/if}
	{/each}
</div>
