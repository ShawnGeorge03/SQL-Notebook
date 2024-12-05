<script lang="ts">
	import EditorSettings from '$lib/components/Blocks/EditorSettings.svelte';
	import TextBlock from '$lib/components/Blocks/TextBlock.svelte';
	import PostgreSQL from '$lib/components/Examples/PostgreSQL.svelte';

	let markdownContent = $state('');
</script>

<div class="m-36 min-h-screen">
	<EditorSettings />
	<PostgreSQL />
	<div class="mt-10 rounded-xl border-4 border-black p-10 shadow-xl">
		<h2 class="mb-5 text-center text-2xl">Markdown Content</h2>
		<TextBlock class="markdown-editor" type="markdown" bind:content={markdownContent} />
	</div>
</div>
