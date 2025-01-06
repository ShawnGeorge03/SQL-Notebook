<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { DBWorkerService } from '$lib/db/worker/service';
	import type { DBInfo } from '$lib/db/worker/types';

	import PostgreSQLIcon from '$lib/assets/db/engines/postgresql.svg?raw';
	import SQLiteIcon from '$lib/assets/db/engines/sqlite.svg?raw';
	import SpinnerIcon from '$lib/assets/spinner.svg?raw';

	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { CreateCellBaseProps } from './type';

	let dbWorkerService;

	let activeDBs: DBInfo[] = $state([]);
	let loading: boolean = $state(true);

	let { position, addNewCell }: CreateCellBaseProps = $props();

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

		() => unsubscribe();
	});
</script>

{#if loading}
	<DropdownMenu.Item
		disabled
		class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
	>
		<span class="me-3 inline h-5 w-5 animate-spin text-white">{@html SpinnerIcon}</span>
		<p>Getting Databases...</p>
	</DropdownMenu.Item>
{:else}
	{#if activeDBs.length === 0}
		<DropdownMenu.Item
			disabled
			class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
		>
			<p>No active databases</p>
		</DropdownMenu.Item>
	{/if}

	<ScrollArea class={cn('w-fit rounded-md', { 'h-24': activeDBs.length > 3 })}>
		{#each activeDBs as { name, engine, persistent }}
			<DropdownMenu.Item
				class="rounded-button flex h-10 select-none items-center py-6 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				onclick={() => addNewCell(position, { cellType: 'query', engine, dbName: name })}
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
	</ScrollArea>
{/if}
