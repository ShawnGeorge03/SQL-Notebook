<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { DBInfo } from '$lib/db/worker/types';
	import { cn } from '$lib/utils';

	import PostgreSQLIcon from '$lib/assets/db/engines/postgresql.svg?raw';
	import SQLiteIcon from '$lib/assets/db/engines/sqlite.svg?raw';
	import SpinnerIcon from '$lib/assets/spinner.svg?raw';
	import { DBWorkerService } from '$lib/db/worker/service';
	import { onMount, type Snippet } from 'svelte';

	interface SelectDBProps {
		class?: string;
		open: boolean;
		children: Snippet;
		onSelect: (db: DBInfo) => void;
	}

	let dbWorkerService: DBWorkerService;
	let activeDBs: DBInfo[] = $state([]);

	let loading: boolean = $state(true);

	let { class: className, open = $bindable(false), children, onSelect }: SelectDBProps = $props();

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

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger
		class={cn(
			'inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white',
			className
		)}
	>
		{@render children?.()}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start">
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
					<p>No Active DBs</p>
				</DropdownMenu.Item>
			{/if}

			<ScrollArea class={cn('w-fit rounded-md', { 'h-24': activeDBs.length > 3 })}>
				{#each activeDBs as db}
					<DropdownMenu.Item
						class="rounded-button flex h-10 select-none items-center py-6 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						onclick={() => onSelect(db)}
					>
						<div class="flex items-center">
							{#if db.engine === 'pgsql'}
								<span class="h-10 w-10" aria-hidden="true">{@html PostgreSQLIcon}</span>
							{:else if db.engine === 'sqlite'}
								<span class="h-10 w-10" aria-hidden="true">{@html SQLiteIcon}</span>
							{/if}
						</div>
						<div class="flex w-32 flex-col justify-start">
							<p class="overflow-hidden text-ellipsis whitespace-nowrap">{db.name}</p>
							<Badge class="w-fit" variant="default">
								{db.persistent ? 'Persistent' : 'In-Memory'}
							</Badge>
						</div>
					</DropdownMenu.Item>
				{/each}
			</ScrollArea>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
