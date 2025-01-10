<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Sidebar from '$lib/components/ui/sidebar';

	import {
		duplicateNotebook,
		notebooks,
		notebooksObservableIDB
	} from '$lib/indexeddb/notebook/utils';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import PostgreSQLIcon from '$lib/assets/db/engines/postgresql.svg?raw';
	import SQLiteIcon from '$lib/assets/db/engines/sqlite.svg?raw';
	import { DBWorkerService } from '$lib/db/worker/service';
	import { DBEngine } from '$lib/db/worker/types';
	import { databases, databasesObservableIDB } from '$lib/indexeddb/database/utils';
	import {
		BadgePlus,
		CircleDot,
		CircleX,
		CopyPlus,
		DatabaseBackup,
		Ellipsis,
		NotebookText,
		Trash
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import preferences from '../../Header/Settings/store';
	import * as Database from './Database/';
	import * as Notebook from './Notebook/';

	let { notebookID } = $props();

	let dbWorkerService: DBWorkerService;

	onMount(() => {
		dbWorkerService = DBWorkerService.getInstance();
	});

	() => {
		notebooksObservableIDB.unsubscribe();
		databasesObservableIDB.unsubscribe();
	};
</script>

<aside
	class="sticky top-0 col-span-1 h-screen w-[250px] overflow-hidden bg-sidebar px-1 py-4 text-sidebar-foreground max-sm:hidden"
>
	<div class="invisible h-[3.45rem] w-full border-b border-sidebar-border"></div>
	<div class="h-fit max-h-[19.5rem] w-full border-b border-t border-sidebar-border pt-2">
		<div class="flex items-center justify-center pb-2 pl-2 pr-1">
			<p class="pl-2 text-xl font-bold">Notebooks</p>
			<Notebook.Create />
		</div>
		<ScrollArea class="h-[15rem] w-full p-2">
			<Sidebar.Menu>
				{#if $notebooks.length === 0}
					<div class="flex flex-col items-center justify-center gap-2 py-10">
						<BadgePlus class="size-20 text-muted-foreground" />
						<p class="text-lg font-semibold text-muted-foreground">Create a Notebook</p>
					</div>
				{/if}
				{#each $notebooks as notebook (notebook.id)}
					<DropdownMenu.Root>
						<Sidebar.MenuItem>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton
										{...props}
										class={notebookID == notebook.id
											? 'bg-sidebar-accent text-sidebar-accent-foreground'
											: ''}
									>
										{notebook.name}
										<Ellipsis class="ml-auto" />
									</Sidebar.MenuButton>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content side="right" align="start" class="min-w-56 rounded-lg">
								<a
									href="notebook/?id={notebook.id}"
									target={$preferences.general.openNotebooksInNewWindow ? '_blank' : '_self'}
									rel="noopener noreferrer"
								>
									<DropdownMenu.Item class="cursor-pointer">
										<NotebookText />
										Open Notebook
									</DropdownMenu.Item>
								</a>
								<DropdownMenu.Item
									class="cursor-pointer"
									onclick={async () => await duplicateNotebook(notebook.id)}
									><CopyPlus /> Duplicate</DropdownMenu.Item
								>
								<DropdownMenu.Item>
									{#snippet child()}
										<Notebook.Rename id={notebook.id} />
									{/snippet}
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									{#snippet child()}
										<Notebook.Delete id={notebook.id} />
									{/snippet}
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									{#snippet child()}
										<Notebook.Info {notebook} />
									{/snippet}
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</Sidebar.MenuItem>
					</DropdownMenu.Root>
				{/each}
			</Sidebar.Menu>
		</ScrollArea>
	</div>

	<div class="h-fit max-h-[19.5rem] w-full border-b border-t border-sidebar-border pt-2">
		<div class="flex items-center justify-center pb-2 pl-2 pr-1">
			<p class="pl-2 text-xl font-bold">Database</p>
			<Database.Create />
		</div>

		<ScrollArea class="h-[15rem] w-full p-2">
			<Sidebar.Menu>
				{#if $databases.length === 0}
					<div class="flex flex-col items-center justify-center gap-2 py-10">
						<BadgePlus class="size-20 text-muted-foreground" />
						<p class="text-lg font-semibold text-muted-foreground">Create a Database</p>
					</div>
				{/if}
				{#each $databases as database (database.id)}
					<DropdownMenu.Root>
						<Sidebar.MenuItem>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props} class="h-fit">
										{#if database.engine === DBEngine.SQLITE}
											<span class="h-5 w-5" aria-hidden="true">{@html SQLiteIcon}</span>
										{:else}
											<span class="h-5 w-5" aria-hidden="true">{@html PostgreSQLIcon}</span>
										{/if}
										<p class="text-lg font-semibold">{database.name}</p>
										<CircleDot size="15" class="text-green-500" />
										<Ellipsis class="ml-auto" />
									</Sidebar.MenuButton>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content side="right" align="start" class="min-w-56 rounded-lg">
								<DropdownMenu.Item
									class="cursor-pointer"
									onclick={() =>
										dbWorkerService.sendMessage({
											command: 'LOAD_DB',
											args: { dbName: database.name }
										})}
								>
									<DatabaseBackup />
									Load
								</DropdownMenu.Item>
								<DropdownMenu.Item
									class="cursor-pointer"
									onclick={() =>
										dbWorkerService.sendMessage({
											command: 'CLOSE_DB',
											args: { dbName: database.name }
										})}><CircleX /> Close</DropdownMenu.Item
								>
								<DropdownMenu.Item
									class="cursor-pointer"
									onclick={() =>
										dbWorkerService.sendMessage({
											command: 'TERMINATE_DB',
											args: { dbName: database.name }
										})}><Trash /> Delete</DropdownMenu.Item
								>
								<DropdownMenu.Item class="cursor-pointer">
									{#snippet child()}
										<Database.Info {database} />
									{/snippet}
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</Sidebar.MenuItem>
					</DropdownMenu.Root>
				{/each}
			</Sidebar.Menu>
		</ScrollArea>
	</div>
</aside>
