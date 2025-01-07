<script lang="ts">
	import { PostgreSQL, sql, SQLite, StandardSQL } from '@codemirror/lang-sql';

	import type { DBEngine, SuccessResponseData } from '$lib/db/worker/types';

	import { DBWorkerService } from '$lib/db/worker/service';
	import { onMount } from 'svelte';
	import SelectDB from '../../SelectDB.svelte';
	import { Actions, Editor } from '../Cell';

	import PostgreSQLIcon from '$lib/assets/db/engines/postgresql.svg?raw';
	import SQLiteIcon from '$lib/assets/db/engines/sqlite.svg?raw';
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown, PaintbrushVertical } from 'lucide-svelte';

	interface CodeEditorProps {
		id: string;
		position: number;
		class?: string;
		dbName: string;
		engine: DBEngine;
		content: string;
		result?: Omit<SuccessResponseData['EXEC_QUERY'], 'id'>;
		moveUpCell: (position: number) => void;
		moveDownCell: (position: number) => void;
		copyCell: (position: number) => void;
		removeCell: (position: number) => void;
	}

	let {
		id,
		position,
		class: className,
		content = $bindable(''),
		dbName = $bindable(''),
		engine = $bindable(),
		result = $bindable(),
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
					content = response.data.query;
				}
			} else if (response.status === 'ERROR') {
				if (response.command === 'EXEC_QUERY') {
					isRunning = false;
					console.error(response.data);
				} else if (response.command === 'FORMAT_QUERY') {
					console.error(response.data);
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
				args: { id, engine: engine, query: content }
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
			dbWorkerService.sendMessage({ command: 'EXEC_QUERY', args: { id, dbName, query: content } });
			result = { data: [], elapsed: 0 };
		}}
		remove={() => removeCell(position)}
		{actions}
	>
		<SelectDB
			bind:open
			onSelect={(db) => {
				dbName = db.name;
				engine = db.engine;
			}}
		>
			<div class="flex items-center gap-3">
				<div class="float-left">
					{#if engine === 'pgsql'}
						<span class="h-10 w-10" aria-hidden="true">{@html PostgreSQLIcon}</span>
					{:else if engine === 'sqlite'}
						<span class="h-10 w-10" aria-hidden="true">{@html SQLiteIcon}</span>
					{/if}
				</div>
				<div class="flex max-w-32">
					<p class="overflow-hidden text-ellipsis whitespace-nowrap">{dbName}</p>
					<span class="ml-2 transition-transform duration-200 {open ? 'rotate-180' : ''}">
						<ChevronDown />
					</span>
				</div>
			</div>
		</SelectDB>
	</Actions>
	<Editor bind:content {customExtensions} />
	<div class={isRunning ? 'hidden' : ''}>
		{JSON.stringify(result)}
	</div>
</div>
