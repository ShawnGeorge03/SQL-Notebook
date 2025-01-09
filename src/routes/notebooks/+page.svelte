<script lang="ts">
	import { Markdown, Query } from '$lib/components/Notebook/Cells';
	import * as CreateCell from '$lib/components/Notebook/CreateCell/index';
	import type { CellMetadata } from '$lib/components/Notebook/CreateCell/type';
	import Notifications from '$lib/components/Notebook/Header/Notifications.svelte';
	import Settings from '$lib/components/Notebook/Header/Settings/Modal.svelte';
	import ThemeToggle from '$lib/components/Notebook/Header/ThemeToggle.svelte';
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
		},
		{
			id: nanoid(),
			cellType: 'query',
			content: {
				name: 'Query',
				query: 'SELECT * FROM genre',
				engine: DBEngine.PGSQL,
				dbName: 'PP'
			}
		},
		{
			id: nanoid(),
			cellType: 'query',
			content: {
				name: 'Query',
				query: `SELECT
  *
FROM
  pg_catalog.pg_type
WHERE
  typtype = 'b' OR
  typtype = 'c' OR
  typtype = 'p' OR
  typtype = 'e'
ORDER BY
  typname;`,
				engine: DBEngine.PGSQL,
				dbName: 'PP'
			}
		}
	]);

	const addNewCell = (position: number, metadata: CellMetadata) => {
		const cell = { id: nanoid(), cellType: metadata.cellType, content: {} };

		switch (metadata.cellType) {
			case 'markdown':
				cell.content = {
					name: cell.id,
					text: ''
				};
				break;
			case 'query':
				cell.content = {
					name: cell.id,
					query: "SELECT 'HELLO WORLD'",
					engine: metadata.engine,
					dbName: metadata.dbName
				};
				break;
		}

		cells.splice(position, 0, cell as NotebookCell);
	};
	const moveUpCell = (position: number) => {
		const cell = cells[position];
		cells.splice(position, 1);
		cells.splice(position - 1, 0, cell);
	};

	const moveDownCell = (position: number) => {
		const cell = cells[position];
		cells.splice(position, 1);
		cells.splice(position + 1, 0, cell);
	};

	const copyCell = (position: number) => {
		const cell = $state.snapshot(cells)[position];
		cell.id = nanoid();
		cells.splice(position + 1, 0, cell);
	};

	const removeCell = (position: number) => {
		cells.splice(position, 1);
	};
</script>

<header class="sticky top-0 z-20 bg-red-500 p-4">
	<div class="float-left flex justify-end gap-4">
		<CreateCell.QueryCell position={cells.length} {addNewCell} />
		<CreateCell.MarkdownCell position={cells.length} {addNewCell} />
	</div>
	<div class="float-right flex justify-end gap-4">
		<Notifications />
		<Settings />
		<ThemeToggle />
	</div>
</header>
<div class="flex flex-col items-center justify-center">
	<CreateCell.ButtonGroup
		class="w-[400px] py-5 transition-[width] duration-300 ease-in-out md:w-[500px] lg:w-[700px] xl:w-[1000px]"
		position={0}
		{addNewCell}
	/>
	{#each cells as cell, i (cell.id)}
		{#if cell.cellType === 'markdown'}
			<Markdown class="py-4" bind:content={cell.content.text} />
		{:else if cell.cellType === 'query'}
			<Query
				class="py-4"
				position={i}
				id={cell.id}
				bind:name={cell.content.name}
				bind:query={cell.content.query}
				bind:dbName={cell.content.dbName}
				bind:engine={cell.content.engine}
				{moveUpCell}
				{moveDownCell}
				{copyCell}
				{removeCell}
			/>
		{/if}
		<CreateCell.ButtonGroup
			class={`w-[400px] transition-[width] duration-300 ease-in-out md:w-[500px] lg:w-[700px] xl:w-[1000px] ${i === cells.length - 1 ? 'pb-24' : ''}`}
			position={i + 1}
			{addNewCell}
		/>
	{/each}
</div>
<footer class="fixed bottom-0 z-20 w-[100%] bg-blue-500 p-4">(footer)</footer>
