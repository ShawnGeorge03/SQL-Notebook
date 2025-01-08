<script lang="ts">
	import MarkdownIcon from '$lib/assets/notebook/actions/markdown.svg?raw';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';

	import { type CreateCellBaseProps } from './type';

	let { class: className, position, addNewCell }: CreateCellBaseProps = $props();
</script>

<Button
	type="button"
	aria-label="Create Markdown Cell"
	onclick={() => addNewCell(position, { cellType: 'markdown' })}
	class={cn(
		'inline-flex h-auto items-center bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white',
		className
	)}
>
	{@html MarkdownIcon}
	Markdown
</Button>
