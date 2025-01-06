<script lang="ts">
	import * as CreateCell from '$lib/components/Notebook/CreateCell/index.js';
	import type { CellMetadata } from '$lib/components/Notebook/CreateCell/type';
	import Notifications from '$lib/components/Notebook/Notifications.svelte';
	import SettingsModal from '$lib/components/Notebook/SettingsModal.svelte';
	import ThemeToggle from '$lib/components/Notebook/ThemeToggle.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import SidebarLeft from '$lib/components/ui/sidebar/sidebar-left.svelte';
	import type { NotebookCell } from '$lib/indexeddb/types';
	import { nanoid } from 'nanoid/non-secure';

	const cells: NotebookCell[] = $state<NotebookCell[]>([]);

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
		<header class="sticky top-0 z-10 bg-red-500 p-4">
			<Sidebar.Trigger />
			<div class="float-right flex justify-end gap-4">
				<Notifications />
				<SettingsModal />
				<ThemeToggle />
			</div>
		</header>
		{#each cells as cell, i (cell.id)}
			<CreateCell.Dropdown position={i} {addNewCell} />
			{#if cell.cellType === 'markdown'}
				<div class="h-fit bg-purple-500 p-4">
					{i + 1}: {cell.content.name}
					<p>{cell.content.text}</p>
				</div>
			{:else if cell.cellType === 'query'}
				<div class="h-fit bg-purple-500 p-4">
					{i + 1}: {cell.content.name}
					<p>
						Running {cell.content.query} on {cell.content.dbName} which is a {cell.content.engine}
						DB
					</p>
				</div>
			{/if}
		{/each}
		<CreateCell.ButtonGroup position={cells.length} {addNewCell} />
		<footer class="fixed bottom-0 z-10 w-[100%] bg-blue-500 p-4">(footer)</footer>
	</Sidebar.Inset>
</Sidebar.Provider>
