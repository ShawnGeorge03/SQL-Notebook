<script lang="ts">
	import { cn } from '$lib/utils';
	import { markdown } from '@codemirror/lang-markdown';
	import { marked } from 'marked';

	import { Editor, type BaseEditorProps } from '../Cell';
	import './github-markdown.css';

	let { class: className, content = $bindable('') }: BaseEditorProps = $props();

	marked.use({
		gfm: true
	});
</script>

<div class={cn('flex gap-4', className)}>
	<Editor class="w-1/2" bind:content customExtensions={[markdown()]} />
	<div class="markdown-body w-1/2 overflow-y-scroll p-2">
		{#await marked.parse(content)}
			<p>Processing Markdown</p>
		{:then HTML}
			{@html HTML}
		{/await}
	</div>
</div>
