<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { onMount } from 'svelte';

	import { DBWorkerService } from '$lib/db/worker/service';
	import type { DBInfo } from '$lib/db/worker/types';

	import ChartIcon from '$lib/assets/add-chart.svg?raw';
	import AIIcon from '$lib/assets/ai.svg?raw';
	import MarkdownIcon from '$lib/assets/markdown.svg?raw';
	import PostgreSQLIcon from '$lib/assets/postgresql.svg?raw';
	import SpinnerIcon from '$lib/assets/spinner.svg?raw';
	import SQLiteIcon from '$lib/assets/sqlite.svg?raw';
	import { CodeXml } from 'lucide-svelte';

	let dbWorkerService;

	let activeDBs: DBInfo[] = $state([]);
	let loading: boolean = $state(false);

	onMount(() => {
		dbWorkerService = DBWorkerService.getInstance();

		const unsubscribe = dbWorkerService.responses.subscribe((response) => {
			loading = response.status === 'LOADING' && response.command === 'GET_ACTIVE_DBS';
			if (response.status === 'SUCCESS' && response.command === 'GET_ACTIVE_DBS') {
				activeDBs = response.data.activeDBs;
				loading = false;
			} else if (response.status === 'ERROR' && response.command === 'GET_ACTIVE_DBS') {
				console.error(response.data);
			}
		});

		dbWorkerService.sendMessage({ command: 'GET_ACTIVE_DBS' });

		console.log(loading);

		() => unsubscribe();
	});
</script>

<div class="m-auto flex w-fit shadow-md" role="group">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="z-10 inline-flex items-center rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
		>
			<div class="flex items-center">
				<CodeXml class="text-foreground-alt mr-2 size-5" />
				Code
			</div>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start">
			{#if loading}
				<DropdownMenu.Item
					class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					<span class="me-3 inline h-5 w-5 animate-spin text-white">{@html SpinnerIcon}</span>
					<p>Getting Databases...</p>
				</DropdownMenu.Item>
			{:else}
				{#if activeDBs.length === 0}
					<DropdownMenu.Item
						class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
					>
						<span>No active databases</span>
					</DropdownMenu.Item>
				{/if}

				{#each activeDBs as { name, engine, persistent }}
					<DropdownMenu.Item
						class="rounded-button flex h-10 select-none items-center py-6 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
					>
						<div class="flex items-center">
							{#if engine === 'pgsql'}
								<span class="h-10 w-10" aria-hidden="true">{@html PostgreSQLIcon}</span>
							{:else if engine === 'sqlite'}
								<span class="h-10 w-10" aria-hidden="true">{@html SQLiteIcon}</span>
							{/if}
						</div>
						<div class="flex w-32 flex-col justify-start">
							<p class="overflow-hidden text-ellipsis whitespace-nowrap">{name}</p>
							{#if persistent}
								<Badge class="w-fit" variant="default">Persistent</Badge>
							{:else}
								<Badge class="w-fit" variant="default">In-Memory</Badge>
							{/if}
						</div>
					</DropdownMenu.Item>
				{/each}
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Button
		type="button"
		class="inline-flex h-fit items-center rounded-none border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
	>
		{@html MarkdownIcon}
		Markdown
	</Button>
	<Button
		type="button"
		class="inline-flex h-fit items-center rounded-none border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
	>
		{@html ChartIcon}
		Chart
	</Button>
	<Button
		type="button"
		class="inline-flex h-fit items-center rounded-l-none border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
	>
		{@html AIIcon}
		Generate with AI
	</Button>
</div>
