<script lang="ts">
	import { page } from '$app/state';
	import * as AppSidebar from '$lib/components/Notebook/AppSidebar/';
	import { Markdown, Query } from '$lib/components/Notebook/Cells';
	import * as CreateCell from '$lib/components/Notebook/CreateCell/index';
	import type { CellMetadata } from '$lib/components/Notebook/CreateCell/type';
	import Notifications from '$lib/components/Notebook/Header/Notifications.svelte';
	import Settings from '$lib/components/Notebook/Header/Settings/Modal.svelte';
	import ThemeToggle from '$lib/components/Notebook/Header/ThemeToggle.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import iDB from '$lib/indexeddb/schema';
	import type { NotebookCell } from '$lib/indexeddb/types';
	import { cn } from '$lib/utils';
	import { nanoid } from 'nanoid/non-secure';
	import { onMount } from 'svelte';

	let cells = $state<NotebookCell[]>([]);

	const notebookID = page.url.searchParams.get('id');
	let loading = $state(true);
	let notebookExists = $state(false);

	onMount(async () => {
		if (!notebookID) {
			loading = false;
			return;
		}
		const notebook = await iDB.notebooks.get(notebookID);
		if (notebook) cells = notebook.cells;
		notebookExists = true;
	});

	$effect(() => {
		if (!notebookID) return;
		const changes = $state.snapshot(cells);
		iDB.notebooks.update(notebookID, {
			cells: changes,
			modifiedOn: new Date().toISOString()
		});
	});

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

<div class="grid grid-cols-1 sm:grid-cols-[auto_1fr]">
	<AppSidebar.Left {notebookID} />
	<main class="bg-background">
		<header class="sticky top-0 z-20 border-b-2 border-r-2 border-t-2 bg-sidebar p-4 pb-14">
			{#if notebookExists}
				<div class="float-left flex justify-end gap-4">
					<CreateCell.QueryCell position={cells.length} {addNewCell} />
					<CreateCell.MarkdownCell position={cells.length} {addNewCell} />
				</div>
			{/if}
			<div class="float-right flex justify-end gap-4">
				<Notifications />
				<Settings />
				<ThemeToggle />
			</div>
		</header>
		<div
			class={`flex flex-col items-center justify-center ${!notebookExists && !loading ? 'h-screen' : 'max-sm:h-screen'}`}
		>
			{#if notebookExists}
				<CreateCell.ButtonGroup
					class="w-[400px] py-5 transition-[width] duration-300 ease-in-out md:w-[500px] lg:w-[700px] xl:w-[1000px]"
					position={0}
					{addNewCell}
				/>

				{#each cells as cell, i (cell.id)}
					{#if cell.cellType === 'markdown'}
						<Markdown
							class="py-4"
							position={i}
							bind:content={cell.content.text}
							{moveUpCell}
							{moveDownCell}
							{copyCell}
							{removeCell}
						/>
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
			{:else if loading}
				{#each { length: 6 }}
					<div class="w-[400px] py-4 md:w-[500px] lg:w-[700px] xl:w-[1000px]">
						<div class="h-10 rounded-t-xl bg-muted"></div>
						<div class="flex flex-col gap-4 bg-white p-6 py-4 dark:bg-slate-800">
							{#each { length: 4 }, i}
								<Skeleton
									class={cn('h-4', {
										'w-1/2': i == 0,
										'w-96': i == 1,
										'w-[50rem]': i == 2,
										'w-[35rem]': i == 3
									})}
								/>
							{/each}
						</div>
						<div class="h-10 rounded-b-xl bg-muted"></div>
					</div>
				{/each}
			{:else}
				<h1 class="text-3xl font-bold">Welcom to your project!</h1>
				<p class="text-xl">You can start by creating or opening a notebook in the left sidebar</p>
			{/if}
		</div>
		<!-- <footer class="fixed bottom-0 z-20 w-[100%] bg-blue-500 p-4">(footer)</footer> -->
	</main>
	<!-- <AppSidebar.Right /> -->
</div>
