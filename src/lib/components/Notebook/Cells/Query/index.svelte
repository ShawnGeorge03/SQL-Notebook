<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Table from '$lib/components/ui/table/index.js';

	import { PostgreSQL, sql, SQLite, StandardSQL } from '@codemirror/lang-sql';

	import type {
		DBEngine,
		DBWorkerErrorResponse,
		DBWorkerSuccessResponse
	} from '$lib/db/worker/types';

	import { DBWorkerService } from '$lib/db/worker/service';
	import { onMount } from 'svelte';
	import SelectDB from '../../SelectDB.svelte';
	import { Actions, Editor } from '../Cell';

	import { dev } from '$app/environment';
	import DatabaseIcon from '$lib/components/Notebook/DatabaseIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown, PaintbrushVertical } from 'lucide-svelte';

	interface CodeEditorProps {
		id: string;
		name: string;
		position: number;
		class?: string;
		dbName: string;
		engine: DBEngine;
		query: string;
		result?: Omit<DBWorkerSuccessResponse['EXEC_QUERY'], 'id'>;
		error?: Omit<DBWorkerErrorResponse['EXEC_QUERY'], 'id'>;
		moveUpCell: (position: number) => void;
		moveDownCell: (position: number) => void;
		copyCell: (position: number) => void;
		removeCell: (position: number) => void;
	}

	const DEFAULT_RESULT = { data: { rows: [], cols: [] }, elapsed: 0 };

	let {
		id,
		name = $bindable(''),
		position,
		class: className,
		query = $bindable(''),
		dbName = $bindable(''),
		engine = $bindable(),
		result = $bindable(DEFAULT_RESULT),
		error = $bindable(),
		moveUpCell,
		moveDownCell,
		copyCell,
		removeCell
	}: CodeEditorProps = $props();

	const customExtensions = [
		sql({
			upperCaseKeywords: true,
			dialect: engine === 'pgsql' ? PostgreSQL : engine === 'sqlite' ? SQLite : StandardSQL
		})
	];

	let dbWorkerService: DBWorkerService;

	let open = $state(false);
	let isRunning = $state(false);

	onMount(() => {
		dbWorkerService = DBWorkerService.getInstance();

		const unsubscribe = dbWorkerService.responses.subscribe((response) => {
			if (response.status === 'SUCCESS') {
				if (response.command === 'EXEC_QUERY' && response.data.id === id) {
					isRunning = false;
					result = {
						data: response.data.data,
						elapsed: response.data.elapsed
					};
				} else if (response.command === 'FORMAT_QUERY' && response.data.id === id) {
					query = response.data.query;
				}
			} else if (response.status === 'ERROR') {
				if (response.command === 'EXEC_QUERY' && response.data.id === id) {
					isRunning = false;
					error = response.data;
				}
			}
		});

		() => unsubscribe();
	});
</script>

{#snippet actions()}
	<Button
		variant="secondary"
		size="icon"
		class="border-none bg-transparent shadow-none"
		onclick={() =>
			dbWorkerService.sendMessage({
				command: 'FORMAT_QUERY',
				args: { id, engine: engine, query: query }
			})}
	>
		<PaintbrushVertical />
	</Button>
{/snippet}

<div class={className}>
	<Actions
		moveUp={() => moveUpCell(position)}
		moveDown={() => moveDownCell(position)}
		copy={() => copyCell(position)}
		run={() => {
			isRunning = true;
			error = undefined;
			dbWorkerService.sendMessage({ command: 'EXEC_QUERY', args: { id, dbName, query: query } });
			result = DEFAULT_RESULT;
		}}
		remove={() => removeCell(position)}
		{actions}
	>
		<div class="flex items-center justify-between gap-5">
			<SelectDB
				bind:open
				onSelect={(db) => {
					dbName = db.name;
					engine = db.engine;
				}}
			>
				<div class="flex items-center gap-3">
					<DatabaseIcon class="float-left h-6 w-6" {engine} />
					<div class="flex max-w-32">
						<p class="overflow-hidden text-ellipsis whitespace-nowrap">{dbName}</p>
						<span class="ml-2 transition-transform duration-200 {open && 'rotate-180'}">
							<ChevronDown />
						</span>
					</div>
				</div>
			</SelectDB>

			<Input type="text" placeholder="Name" class="mr-4 w-1/5" bind:value={name} />
		</div>
	</Actions>
	<Editor
		class="w-[400px] transition-[width] duration-300 ease-in-out md:w-[500px] lg:w-[700px] xl:w-[1000px]"
		bind:content={query}
		{customExtensions}
	/>
	{#if error}
		<div
			class="w-[400px] rounded-ee-md rounded-es-md border bg-primary-foreground p-4 text-red-500 transition-[width] duration-300 ease-in-out dark:text-red-600 md:w-[500px] lg:w-[700px] xl:w-[1000px]"
		>
			<p class="text-xl font-bold">
				{error.name
					.toLocaleLowerCase()
					.split('_')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ')}
			</p>
			<div class="pl-2">
				<p class="text-lg">{error.message}</p>
				{#if dev}
					<pre class="text-sm">{error.stack}</pre>
				{/if}
			</div>
		</div>
	{/if}
	<ScrollArea
		class={`${result.data.rows.length < 10 ? 'max-h-96' : 'h-96'} ${error && 'hidden'} w-[400px] rounded-ee-md rounded-es-md bg-primary-foreground p-5 transition-[width] duration-300 ease-in-out md:w-[500px] lg:w-[700px] xl:w-[1000px]`}
		orientation="both"
	>
		<Table.Root
			class={`${!isRunning && result.data.cols.length === 0 && 'hidden'} min-w-full border border-gray-300 bg-gray-100 p-6 dark:border-gray-600 dark:bg-gray-800`}
		>
			<Table.Header>
				<Table.Row class="bg-green-600 text-white">
					{#if isRunning}
						{#each { length: 8 }}
							<Table.Head
								class="border border-gray-300 px-4 py-2 text-left font-bold dark:border-gray-600"
							>
								<Skeleton class="ml-auto bg-slate-100 p-2 dark:bg-slate-600" />
							</Table.Head>
						{/each}
					{:else}
						{#each result.data.cols as col}
							<Table.Head
								class="border border-gray-300 px-4 py-2 text-left font-bold dark:border-gray-600"
							>
								<p class="text-lg font-bold text-white">{col.name}</p>
								<span class="text-xs text-gray-200">{col.type} </span>
							</Table.Head>
						{/each}
						<Table.Head
							class="w-1/2 border border-gray-300 px-4 py-2 text-center dark:border-gray-600"
						/>
					{/if}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if isRunning}
					{#each { length: 4 }}
						<Table.Row
							class="odd:bg-gray-100 even:bg-white odd:hover:bg-blue-200 even:hover:bg-blue-100 odd:dark:bg-gray-700 even:dark:bg-gray-800 odd:dark:hover:bg-blue-500 even:dark:hover:bg-blue-600"
						>
							{#each { length: 8 }}
								<Table.Cell
									class="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-gray-200"
								>
									<Skeleton class="ml-auto bg-slate-200 p-1 dark:bg-gray-400" />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					{#each result.data.rows as row}
						<Table.Row
							class="odd:bg-gray-100 even:bg-white odd:hover:bg-blue-200 even:hover:bg-blue-100 odd:dark:bg-gray-700 even:dark:bg-gray-800 odd:dark:hover:bg-blue-500 even:dark:hover:bg-blue-600"
						>
							{#each row as cell}
								<Table.Cell
									class="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-gray-200"
								>
									{cell}
								</Table.Cell>
							{/each}

							<Table.Cell
								class="border border-gray-300 px-4 py-2 text-gray-800 dark:border-gray-600 dark:text-gray-200"
							/>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</ScrollArea>
</div>
