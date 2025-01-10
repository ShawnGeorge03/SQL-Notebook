<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { cn } from '$lib/utils';
	import { liveQuery } from 'dexie';

	import CloseDBIcon from '$lib/assets/db/actions/close-db.svg?raw';
	import CreateDBIcon from '$lib/assets/db/actions/create-db.svg?raw';
	import DropDBIcon from '$lib/assets/db/actions/drop-db.svg?raw';
	import LoadDBIcon from '$lib/assets/db/actions/load-db.svg?raw';
	import { BadgePlus, CircleDot, CopyPlus, Ellipsis, NotebookText } from 'lucide-svelte';

	import { DBWorkerService } from '$lib/db/worker/service';
	import { duplicateNotebook, type NotebookStore } from '$lib/indexeddb/notebook';
	import iDB from '$lib/indexeddb/schema';
	import type { Database } from '$lib/indexeddb/types';
	import { onMount } from 'svelte';
	import DatabaseIcon from '../../DatabaseIcon.svelte';
	import * as DatabaseAction from './Database/';
	import * as NotebookAction from './Notebook/';

	let notebookLoading = $state(true);
	let databaseLoading = $state(true);

	let notebooks = liveQuery<NotebookStore[]>(() =>
		iDB.notebooks
			.toArray()
			.then((results) =>
				results.map((result) => ({
					id: result.id,
					name: result.name,
					createdBy: result.createdBy,
					createdOn: result.createdOn,
					modifiedOn: result.modifiedOn
				}))
			)
			.finally(() => (notebookLoading = false))
	);

	let databases = liveQuery<Database[]>(() =>
		iDB.databases.toArray().finally(() => (databaseLoading = false))
	);

	let dbWorkerService: DBWorkerService;

	onMount(() => {
		dbWorkerService = DBWorkerService.getInstance();
	});
</script>

<aside
	class="sticky top-0 col-span-1 h-screen w-[250px] overflow-y-hidden bg-sidebar px-1 py-4 text-sidebar-foreground max-sm:hidden"
>
	<div class="invisible h-[3.45rem] w-full border-b border-sidebar-border"></div>
	<div class="h-fit max-h-[19.5rem] w-full border-b border-t border-sidebar-border pt-2">
		<div class="flex items-center justify-between pb-1 pl-1 pr-3">
			<p class="pl-2 text-xl font-bold">Notebooks</p>
			<NotebookAction.Create />
		</div>
		<ScrollArea class="h-[15rem] w-full p-2">
			<Sidebar.Menu>
				{#if notebookLoading}
					{#each { length: 8 }, i}
						<Sidebar.MenuItem
							class="flex h-8 w-full items-center justify-between gap-2 overflow-hidden rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
						>
							<Skeleton
								class={cn('h-4', {
									'w-32': i == 0,
									'w-20': i == 1,
									'w-64': i == 2,
									'w-40': i == 3,
									'w-56': i == 4,
									'w-24': i == 5,
									'w-80': i == 6,
									'w-48': i == 7
								})}
							/>
							<Ellipsis class="ml-auto" />
						</Sidebar.MenuItem>
					{/each}
				{/if}
				{#each $notebooks as notebook (notebook.id)}
					<DropdownMenu.Root>
						<Sidebar.MenuItem>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props}>
										{notebook.name}
										<Ellipsis class="ml-auto" />
									</Sidebar.MenuButton>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content side="right" align="start" class="min-w-56 rounded-lg">
								<DropdownMenu.Item>
									<NotebookText />
									Open Notebook
								</DropdownMenu.Item>
								<DropdownMenu.Item onclick={async () => await duplicateNotebook(notebook.id)}>
									<CopyPlus /> Duplicate
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									{#snippet child()}
										<NotebookAction.Rename notebookID={notebook.id} />
									{/snippet}
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									{#snippet child()}
										<NotebookAction.Delete notebookID={notebook.id} />
									{/snippet}
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									{#snippet child()}
										<NotebookAction.Info {notebook} />
									{/snippet}
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</Sidebar.MenuItem>
					</DropdownMenu.Root>
				{:else}
					<div class="flex flex-col items-center justify-center gap-2 py-10">
						<BadgePlus class="size-20 text-muted-foreground" />
						<p class="text-lg font-semibold text-muted-foreground">Create a Notebook</p>
					</div>
				{/each}
			</Sidebar.Menu>
		</ScrollArea>
	</div>

	<div class="h-fit max-h-[19.5rem] w-full border-b border-t border-sidebar-border pt-2">
		<div class="flex items-center justify-between pb-1 pl-1 pr-3">
			<p class="pl-2 text-xl font-bold">Databases</p>
			<DatabaseAction.Create />
		</div>
		<ScrollArea class="h-[15rem] w-full p-2">
			<Sidebar.Menu>
				{#if databaseLoading}
					{#each { length: 8 }, i}
						<Sidebar.MenuItem
							class="flex h-8 w-full items-center justify-between gap-2 overflow-hidden rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
						>
							<Skeleton
								class={cn('h-4', {
									'w-32': i == 0,
									'w-20': i == 1,
									'w-64': i == 2,
									'w-40': i == 3,
									'w-56': i == 4,
									'w-24': i == 5,
									'w-80': i == 6,
									'w-48': i == 7
								})}
							/>
							<Ellipsis class="ml-auto" />
						</Sidebar.MenuItem>
					{/each}
				{/if}
				{#each $databases as database (database.id)}
					<DropdownMenu.Root>
						<Sidebar.MenuItem>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props}>
										<DatabaseIcon class="min-h-6 min-w-6" engine={database.engine} />
										<p
											class="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold"
										>
											{database.name}
										</p>
										{#if database.status === 'AVAILABLE'}
											<CircleDot size="15" class="text-green-500" />
										{:else if database.status === 'LOADING'}
											<CircleDot size="15" class="text-yellow-500" />
										{:else if database.status === 'UNAVAILABLE'}
											<CircleDot size="15" class="text-red-500" />
										{/if}
										<Ellipsis class="ml-auto" />
									</Sidebar.MenuButton>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content side="right" align="start" class="min-w-56 rounded-lg">
								<DropdownMenu.Item
									onclick={() =>
										dbWorkerService.sendMessage({
											command: 'LOAD_DB',
											args: { dbName: database.name }
										})}
								>
									<span class="inline-block h-6 w-6" aria-hidden="true">
										{@html LoadDBIcon}
									</span> Load
								</DropdownMenu.Item>
								<DropdownMenu.Item
									onclick={() =>
										dbWorkerService.sendMessage({
											command: 'CLOSE_DB',
											args: { dbName: database.name }
										})}
								>
									<span class="inline-block h-6 w-6" aria-hidden="true">
										{@html CloseDBIcon}
									</span> Close
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<span class="inline-block h-6 w-6" aria-hidden="true">
										{@html DropDBIcon}
									</span> Drop
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									{#snippet child()}
										<DatabaseAction.Info {database} />
									{/snippet}
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</Sidebar.MenuItem>
					</DropdownMenu.Root>
				{:else}
					<div class="flex flex-col items-center justify-center gap-2 py-10">
						<span class="inline-block size-20 text-muted-foreground" aria-hidden="true">
							{@html CreateDBIcon}
						</span>
						<p class="text-lg font-semibold text-muted-foreground">Create a Database</p>
					</div>
				{/each}
			</Sidebar.Menu>
		</ScrollArea>
	</div>
</aside>
