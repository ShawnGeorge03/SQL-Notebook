<script lang="ts">
	import { PostgreSQL, sql, SQLite, StandardSQL } from '@codemirror/lang-sql';

	import type { DBEngine } from '$lib/db/worker/types';
	import { Editor } from '../Cell';

	interface CodeEditorProps {
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
	}: CodeEditorProps = $props();

	const customExtensions = [
		sql({
			upperCaseKeywords: true,
			dialect: engine === 'pgsql' ? PostgreSQL : engine === 'sqlite' ? SQLite : StandardSQL
		})
	];
</script>

<Editor class={className} bind:content {customExtensions} />
