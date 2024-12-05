<script lang="ts">
	import type { NotebookData } from '$lib/data/schema';
	import { nanoid } from 'nanoid/non-secure';
	import editorConfig, {
		updateHighlightTrailingWhitespace,
		updateHighlightWhitespace,
		updateLineNumbers
	} from '../Blocks/Block/store';
	import CodeBlock from '../Blocks/CodeBlock.svelte';
	import CellAdder from './CellAdder.svelte';
	import type { AddCell } from './type';

	let blocks: NotebookData[] = $state([]);

	let cellToAdd: AddCell = $state(undefined);

	$effect(() => {
		if (cellToAdd) {
			if (cellToAdd.cell === 'sql') {
				blocks.push({
					id: nanoid(),
					cell: 'sql',
					dbName: cellToAdd.dbName,
					engine: cellToAdd.engine,
					content: {
						query: '',
						result: {}
					}
				});
			}
			cellToAdd = undefined;
		}
	});
</script>

<div class="mt-10 flex flex-col items-center gap-10">
	<h2 class="text-lg font-semibold">Notebook</h2>

	<div class="flex w-full flex-col gap-4">
		{#each blocks as block, i}
			{#if block.cell === 'sql'}
				<CodeBlock
					id={block.id}
					bind:engine={block.engine}
					bind:dbName={block.dbName}
					bind:query={block.content.query}
					bind:result={block.content.result}
					ondelete={() => blocks.splice(i, 1)}
				/>
			{/if}
		{/each}
	</div>

	<CellAdder bind:cellToAdd />

	{#if blocks.length !== 0}
		<div class="mt-32 flex flex-col items-center gap-4">
			<h3 class="text-lg font-semibold">Block Settings</h3>
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
	{/if}
</div>
