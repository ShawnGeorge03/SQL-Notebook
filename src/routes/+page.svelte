<script lang="ts">
	import editorConfig, {
		updateHighlightTrailingWhitespace,
		updateHighlightWhitespace,
		updateLineNumbers
	} from '$lib/components/Blocks/Block/store';
	import TextBlock from '$lib/components/Blocks/TextBlock.svelte';
	import PostgreSQL from '$lib/components/Examples/PostgreSQL.svelte';

	let markdownContent = $state('');
</script>

<div class="m-36 min-h-screen">
	<PostgreSQL />

	<!-- TextBlock Section for Markdown Input -->
	<div class="mt-10">
		<p>Markdown Content:</p>
		<TextBlock class="markdown-editor" type="markdown" bind:content={markdownContent} />
	</div>

	<div class="mt-10">
		<p>Code Editor Settings</p>
		<div class="flex items-center justify-center gap-10">
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => updateLineNumbers()}
			>
				{$editorConfig.lineNumbers ? 'Remove line numbers' : 'Add line numbers'}
			</button>
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => updateHighlightWhitespace()}
			>
				{$editorConfig.highlightWhitespace ? 'Unhighlight Whitespace' : 'Highlight Whitespace'}
			</button>
			<button
				class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
				onclick={() => updateHighlightTrailingWhitespace()}
			>
				{$editorConfig.highlightTrailingWhitespace
					? 'Unhighlight Trailing Whitespace'
					: 'Highlight Trailing Whitespace'}
			</button>
		</div>
	</div>
</div>
