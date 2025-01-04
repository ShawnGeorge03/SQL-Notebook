<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import CreateCellDropdownContent from './CreateCellDropdownContent.svelte';

	import AIIcon from '$lib/assets/notebook/actions/ai.svg?raw';
	import ChartIcon from '$lib/assets/notebook/actions/chart.svg?raw';
	import MarkdownIcon from '$lib/assets/notebook/actions/markdown.svg?raw';
	import QueryIcon from '$lib/assets/notebook/actions/query.svg?raw';

	let open = $state(false);
</script>

<div class="m-auto flex w-fit shadow-md" role="group">
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger
			class="z-10 inline-flex items-center rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
		>
			<div class="flex items-center">
				<span class="text-foreground-alt mr-2 size-5">
					{@html QueryIcon}
				</span>
				Code
				<span class="ml-2 transition-transform duration-200 {open ? 'rotate-180' : ''}"> ▼ </span>
			</div>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start">
			<CreateCellDropdownContent />
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Button
		type="button"
		class="inline-flex h-fit items-center rounded-none border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
	>
		{@html MarkdownIcon}
		Markdown
	</Button>
	<Button
		type="button"
		class="inline-flex h-fit items-center rounded-none border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
	>
		{@html ChartIcon}
		Chart
	</Button>
	<Button
		type="button"
		class="inline-flex h-fit items-center rounded-l-none border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
	>
		{@html AIIcon}
		Create with AI
	</Button>
</div>
