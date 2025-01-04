<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import { DBWorkerService } from '$lib/db/worker/service';
	import type { DBInfo } from '$lib/db/worker/types';

	import PostgreSQLIcon from '$lib/assets/postgresql.svg?raw';
	import SpinnerIcon from '$lib/assets/spinner.svg?raw';
	import SQLiteIcon from '$lib/assets/sqlite.svg?raw';

	import { ChartArea, CodeXml, FileType, Plus } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let dbWorkerService;

	let activeDBs: DBInfo[] = $state([]);
	let loading: boolean = $state(true);

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

<div
	class="flex items-center justify-between p-1 opacity-0 transition-opacity duration-200 ease-in-out focus-within:opacity-100 hover:opacity-100"
>
	<hr class="h-0.5 w-1/2 border-0 bg-muted-foreground" />

	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="duration-250 mx-1 inline-flex h-6 w-6 select-none items-center justify-center rounded-full text-sm font-medium transition-[background-color] ease-linear hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger><Plus class="h-6 w-6 text-muted-foreground" /></Tooltip.Trigger>
					<Tooltip.Content>
						<p>Click to add a new cell</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content
			class="focus-override w-20 rounded-xl border border-muted bg-background px-1 py-1.5 outline-none focus-visible:outline-none"
		>
			<DropdownMenu.Item
				class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
			>
				<div class="flex items-center">
					<FileType class="text-foreground-alt mr-2 size-5" />
					Markdown
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
			>
				<div class="flex items-center">
					<ChartArea class="text-foreground-alt mr-2 size-5" />
					Chart
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger
					class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
				>
					<div class="flex items-center">
						<CodeXml class="text-foreground-alt mr-2 size-5" />
						Code
					</div>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent
					class=" h-fit w-52 rounded-xl border border-muted bg-background px-1 py-1.5 !ring-0 !ring-transparent"
					sideOffset={10}
				>
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
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<hr class=" h-0.5 w-1/2 border-0 bg-muted-foreground" />
</div>
