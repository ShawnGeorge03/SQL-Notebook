<script lang="ts">
	import EditorSettings from '$lib/components/Blocks/EditorSettings.svelte';
	import TextBlock from '$lib/components/Blocks/TextBlock.svelte';
	import DuckDB from '$lib/components/Examples/DuckDB.svelte';
	import PostgreSQL from '$lib/components/Examples/PostgreSQL.svelte';

	let markdownContent = $state('');
</script>

<div class="mx-36 mt-10 min-h-screen">
	<EditorSettings />
	<div class="flex flex-col gap-10">
		<PostgreSQL />
		<DuckDB />
	</div>
	<div class="mt-10 rounded-xl border-4 border-black p-10 shadow-xl">
		<h2 class="mb-5 text-center text-2xl">Markdown Content</h2>
		<TextBlock class="markdown-editor" type="markdown" bind:content={markdownContent} />
	</div>
</div>
