<script lang="ts">

	import Block from "$lib/components/Block.svelte";
	import { getEditorConfig, setEditorConfig } from "$lib/components/context";

	let content = $state("Hey there, this from the \\blocks");

	setEditorConfig()
	const editorConfig = getEditorConfig();

	const updateLineNumbers = () => {
		editorConfig.update((config) => ({
			...config,
			lineNumbers: !config.lineNumbers
		}));
	};

	const updateHighlightWhitespace = () => {
		editorConfig.update((config) => ({
			...config,
			highlightWhitespace: !config.highlightWhitespace
		}));
	};

	const updateHighlightTrailingWhitespace = () => {
		editorConfig.update((config) => ({
			...config,
			highlightTrailingWhitespace: !config.highlightTrailingWhitespace
		}));
	};
</script>


<div class="m-36 min-h-screen">
	<Block bind:content />
	<p class="whitespace-pre-wrap">{content}</p>
	<div class="mt-10 flex items-center justify-center gap-10">
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
			{$editorConfig.highlightWhitespace ? 'Highlight Whitespace' : 'Unhighlight Whitespace'}
		</button>
		<button
			class="cursor-pointer rounded border-none bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
			onclick={() => updateHighlightTrailingWhitespace()}
		>
			{$editorConfig.highlightTrailingWhitespace ? 'Highlight Trailing Whitespace' : 'Unhighlight Trailing Whitespace'}
		</button>
	</div>
</div>