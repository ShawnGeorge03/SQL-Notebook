<script lang="ts">
	import { cn } from '$lib/utils';
	import { markdown } from '@codemirror/lang-markdown';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { Play, Pen } from 'lucide-svelte';

	import { Actions, Editor, type BaseEditorProps } from '../Cell';
	import './github-markdown.css';
	import Button from '$lib/components/ui/button/button.svelte';

	let { class: className, content = $bindable('') }: BaseEditorProps = $props();
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

	const sanitizedContent = async () => {
		const parsedContent = await marked.parse(content);
		return DOMPurify.sanitize(parsedContent);
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
			<Editor class="w-full" bind:content customExtensions={[markdown()]} />
		{:else}
			<div class="markdown-body h-[18.5rem] w-full overflow-y-scroll p-4">
				{#await sanitizedContent()}
					<p>Loading...</p>
				{:then sanitizedContent}
					{@html sanitizedContent}
				{/await}
			</div>
		{/if}
	</div>
</div>
