<script lang="ts">
	import { Markdown, Query } from '$lib/components/Notebook/Cells';
	import * as CreateCell from '$lib/components/Notebook/CreateCell/index';
	import type { CellMetadata } from '$lib/components/Notebook/CreateCell/type';
	import Notifications from '$lib/components/Notebook/Header/Notifications.svelte';
	import Settings from '$lib/components/Notebook/Header/Settings/Modal.svelte';
	import ThemeToggle from '$lib/components/Notebook/Header/ThemeToggle.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import SidebarLeft from '$lib/components/ui/sidebar/sidebar-left.svelte';
	import { DBEngine } from '$lib/db/worker/types';
	import type { NotebookCell } from '$lib/indexeddb/types';
	import { nanoid } from 'nanoid/non-secure';

	const cells: NotebookCell[] = $state<NotebookCell[]>([
		{
			id: nanoid(),
			cellType: 'markdown',
			content: {
				name: 'Markdown',
				text: 'Hello World, This is Markdown'
			}
		},
		{
			id: nanoid(),
			cellType: 'query',
			content: {
				name: 'Query',
				query: "SELECT 'HELLO WORLD'",
				engine: DBEngine.PGSQL,
				dbName: 'PP'
			}
		}
	]);

	const addNewCell = (position: number, metadata: CellMetadata) => {
		switch (metadata.cellType) {
			case 'markdown':
				cells.splice(position, 0, {
					id: nanoid(),
					cellType: 'markdown',
					content: {
						name: '',
						text: ''
					}
				});
				break;
			case 'query':
				cells.splice(position, 0, {
					id: nanoid(),
					cellType: 'query',
					content: {
						name: '',
						query: "SELECT 'HELLO WORLD'",
						engine: metadata.engine,
						dbName: metadata.dbName
					}
				});
		}
	};
</script>

<Sidebar.Provider>
	<SidebarLeft />
	<Sidebar.Inset class="space-y-4 bg-green-500">
		<header class="sticky top-0 z-20 bg-red-500 p-4">
			<div class="float-left flex justify-end gap-4">
				<Sidebar.Trigger />
				<CreateCell.QueryCell position={cells.length} {addNewCell} />
				<CreateCell.MarkdownCell position={cells.length} {addNewCell} />
			</div>
			<div class="float-right flex justify-end gap-4">
				<Notifications />
				<Settings />
				<ThemeToggle />
			</div>
		</header>
		<CreateCell.ButtonGroup position={0} {addNewCell} />
		{#each cells as cell, i (cell.id)}
			{#if cell.cellType === 'markdown'}
				<div class="h-fit bg-purple-500 p-4">
					{i + 1}: {cell.content.name} ({cell.id})
					<Markdown bind:content={cell.content.text} />
				</div>
			{:else if cell.cellType === 'query'}
				<Query
					class="m-4 h-fit"
					id={cell.id}
					bind:content={cell.content.query}
					bind:dbName={cell.content.dbName}
					bind:engine={cell.content.engine}
				/>
			{/if}
			<CreateCell.ButtonGroup
				class={i === cells.length - 1 ? 'pb-24' : ''}
				position={i + 1}
				{addNewCell}
			/>
		{/each}
		<footer class="fixed bottom-0 z-20 w-[100%] bg-blue-500 p-4">(footer)</footer>
	</Sidebar.Inset>
</Sidebar.Provider>
