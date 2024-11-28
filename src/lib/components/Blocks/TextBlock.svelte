<script lang="ts">
	import Editor, { type BaseBlockProps } from '$lib/components/Blocks/Block/index.svelte';
	import { markdown } from '@codemirror/lang-markdown';
	import { marked } from 'marked';
	import 'github-markdown-css';
	import DOMPurify from 'dompurify';

	interface TextBlockProps extends BaseBlockProps {
		content: string;
		type: 'markdown';
	}

	let { class: className, content = $bindable('') }: TextBlockProps = $props();
	let customExtensions = [markdown()];
	let htmlContent = $state('');

	// Function to sanitize and render the Markdown content
	const renderMarkdown = async () => {
		const rawHtml = await marked(content);
		htmlContent = DOMPurify.sanitize(rawHtml);
	};
</script>

<!-- Using the base Editor component to render Markdown content -->
<div class="markdown-body">
	<Editor
		autocomplete="on"
		autocorrect="on"
		autocapitalize="on"
		spellcheck="on"
		class={className}
		bind:content
		{customExtensions}
	/>
	<button class="render-button" onclick={renderMarkdown}>Render Markdown</button>
	<div class="markdown-preview">
		{@html htmlContent}
	</div>
</div>

<style>
	.markdown-body {
		padding: 1em;
	}

	.render-button {
		padding: 0.5em 1em;
		margin-top: 1em;
		background-color: #007acc;
		color: white;
		border: none;
		cursor: pointer;
		border-radius: 4px;
	}

	.render-button:hover {
		background-color: #005fa3;
	}

	.markdown-preview {
		border-top: 1px solid #ddd;
		padding-top: 1em;
		margin-top: 1em;
	}
</style>
