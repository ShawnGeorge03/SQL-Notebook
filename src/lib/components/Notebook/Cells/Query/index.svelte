<script lang="ts">
	import { PostgreSQL, sql, SQLite, StandardSQL } from '@codemirror/lang-sql';

	import type { DBEngine } from '$lib/db/worker/types';
	import Cell from '../Cell.svelte';

	interface CodeBlockProps {
		id: string;
		class?: string;
		dbName: string;
		engine: DBEngine;
		content: string;
	}

	let {
		id,
		class: className,
		content = $bindable(''),
		dbName = $bindable(''),
		engine = $bindable()
	}: CodeBlockProps = $props();

	const customExtensions = [
		sql({
			upperCaseKeywords: true,
			dialect: engine === 'pgsql' ? PostgreSQL : engine === 'sqlite' ? SQLite : StandardSQL
		})
	];
</script>

<Cell class={className} bind:content {customExtensions} />
