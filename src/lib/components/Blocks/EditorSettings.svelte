<script lang="ts">
	import editorConfig, {
		updateHighlightTrailingWhitespace,
		updateHighlightWhitespace,
		updateLineNumbers
	} from '$lib/components/Blocks/Block/store';
</script>

<div class="mb-10">
	<h2 class="mb-5 text-center text-2xl">Code Editor Settings</h2>
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
