<script lang="ts">
	import { PostgreSQL, sql, SQLite, StandardSQL } from '@codemirror/lang-sql';

	import type { DBEngine, DBInfo, SuccessResponseData } from '$lib/db/worker/types';

	import { DBWorkerService } from '$lib/db/worker/service';
	import { onMount } from 'svelte';
	import SelectDB from '../../SelectDB.svelte';
	import { Editor } from '../Cell';

	import PostgreSQLIcon from '$lib/assets/db/engines/postgresql.svg?raw';
	import SQLiteIcon from '$lib/assets/db/engines/sqlite.svg?raw';
	import { ChevronDown } from 'lucide-svelte';

	interface CodeEditorProps {
		id: string;
		class?: string;
		dbName: string;
		engine: DBEngine;
		content: string;
		result?: Omit<SuccessResponseData['EXEC_QUERY'], 'id'>;
	}

	let {
		id,
		class: className,
		content = $bindable(''),
		dbName = $bindable(''),
		engine = $bindable(),
		result = $bindable()
	}: CodeEditorProps = $props();

	const customExtensions = [
		sql({
			upperCaseKeywords: true,
			dialect: engine === 'pgsql' ? PostgreSQL : engine === 'sqlite' ? SQLite : StandardSQL
		})
	];

	let dbWorkerService: DBWorkerService;
	let activeDBs: DBInfo[] = $state([]);

	let open = $state(false);
	let loading: boolean = $state(true);

	onMount(() => {
		dbWorkerService = DBWorkerService.getInstance();

		dbWorkerService.sendMessage({ command: 'GET_ACTIVE_DBS' });

		const unsubscribe = dbWorkerService.responses.subscribe((response) => {
			if (response.status === 'SUCCESS') {
				if (response.command === 'GET_ACTIVE_DBS') {
					loading = false;
					activeDBs = response.data.activeDBs;
				}
			} else if (response.status === 'ERROR') {
				if (response.command === 'GET_ACTIVE_DBS') {
					console.error(response.data);
				}
			}
		});

		() => unsubscribe();
	});
</script>

<div class={className}>
	<div class="relative rounded-t-xl bg-primary-foreground py-2 pl-3">
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
	</div>
	<Editor bind:content {customExtensions} />
	<div class={!result ? 'hidden' : ''}>
		{JSON.stringify(result)}
	</div>
</div>
