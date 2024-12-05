<script lang="ts">
	import EditorSettings from '$lib/components/Blocks/EditorSettings.svelte';
	import TextBlock from '$lib/components/Blocks/TextBlock.svelte';
	import PostgreSQL from '$lib/components/Examples/PostgreSQL.svelte';

	let markdownContent = $state('');
</script>

<div class="m-36 min-h-screen">
	<EditorSettings />
	<PostgreSQL />

	<!-- TextBlock Section for Markdown Input -->
	<div class="mt-10">
		<p>Markdown Content:</p>
		<TextBlock class="markdown-editor" type="markdown" bind:content={markdownContent} />
	</div>
</div>
