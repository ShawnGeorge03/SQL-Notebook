<script lang="ts">
	import { cn } from '$lib/utils';
	import { markdown } from '@codemirror/lang-markdown';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { Play, Pen } from 'lucide-svelte';

	import { Actions, Editor, type BaseEditorProps } from '../Cell';
	import './github-markdown.css';
	import Button from '$lib/components/ui/button/button.svelte';
	import MarkdownIcon from '$lib/assets/notebook/actions/markdown.svg?raw';

	let editable = $state(false);
	let markdownDiv: HTMLDivElement;

	interface MarkdownEditorProps {
		class?: string;
		content: string;
		position: number;
		moveUpCell: (position: number) => void;
		moveDownCell: (position: number) => void;
		copyCell: (position: number) => void;
		removeCell: (position: number) => void;
	}

	let {
		class: className,
		position,
		content = $bindable(''),
		moveUpCell,
		moveDownCell,
		copyCell,
		removeCell
	}: MarkdownEditorProps = $props();

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

	const sanitizedContent = async () => {
		const parsedContent = await marked.parse(content);
		return DOMPurify.sanitize(parsedContent);
	};
</script>

{#snippet actions()}
	{#if editable}
		<Button
			variant="secondary"
			size="icon"
			class="border-none bg-transparent shadow-none"
			onclick={() => {
				editable = false;
				markdownDiv.focus();
			}}
		>
			<Play />
		</Button>
	{:else}
		<Button
			variant="secondary"
			size="icon"
			class="border-none bg-transparent shadow-none"
			onclick={() => {
				editable = true;
				markdownDiv.focus();
			}}
		>
			<Pen />
		</Button>
	{/if}
{/snippet}

<div class={cn(className)}>
	<Actions
		class="rounded-md"
		moveUp={() => moveUpCell(position)}
		moveDown={() => moveDownCell(position)}
		copy={() => copyCell(position)}
		remove={() => removeCell(position)}
		{actions}
	>
		{@html MarkdownIcon}
		<div
			class="rounded-md pt-2"
			onkeydown={handleKeydown}
			role="button"
			tabindex="0"
			bind:this={markdownDiv}
		>
			{#if editable}
				<Editor bind:content customExtensions={[markdown()]} />
			{:else}
				<div class="markdown-body h-[18.5rem] overflow-y-scroll p-4">
					{#await sanitizedContent()}
						<p>Loading...</p>
					{:then sanitizedContent}
						{@html sanitizedContent}
					{/await}
				</div>
			{/if}
		</div>
	</Actions>
</div>
