<script lang="ts">
	import { cn } from '$lib/utils';
	import { markdown } from '@codemirror/lang-markdown';
	import { marked } from 'marked';
	import { Play, Pen } from 'lucide-svelte';

	import Cell, { type BaseBlockProps } from '../Cell.svelte';
	import './github-markdown.css';
	import Button from '$lib/components/ui/button/button.svelte';

	let { class: className, content = $bindable('') }: BaseBlockProps = $props();
	let editable = $state(true);
	let markdownDiv: HTMLDivElement;

	marked.use({
		gfm: true
	});

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.shiftKey && event.key === 'Enter') {
			editable = !editable;
			if (!editable) {
				markdownDiv.focus();
			}
		}
	};
</script>

<div class={cn('flex gap-4', className)}>
	<div
		class="w-full flex-col"
		onkeydown={handleKeydown}
		role="button"
		tabindex="0"
		bind:this={markdownDiv}
	>
		<div class="flex">
			<Button onclick={() => (editable = !editable)} class="ml-auto">
				{#if editable}
					<Play size="15" />Render Markdown
				{:else}
					<Pen size="15" />Edit Markdown
				{/if}
			</Button>
		</div>
		{#if editable}
			<Cell class="w-full" bind:content customExtensions={[markdown()]} />
		{:else}
			<div class="markdown-body h-[18.5rem] w-full overflow-y-scroll p-4">
				{@html marked.parse(content)}
			</div>
		{/if}
	</div>
</div>
