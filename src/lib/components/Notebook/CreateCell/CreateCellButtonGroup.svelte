<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import CreateCellDropdownContent from './CreateCellDropdownContent.svelte';

	import ChartIcon from '$lib/assets/add-chart.svg?raw';
	import AIIcon from '$lib/assets/ai.svg?raw';
	import MarkdownIcon from '$lib/assets/markdown.svg?raw';
	import { CodeXml } from 'lucide-svelte';
</script>

<div class="m-auto flex w-fit shadow-md" role="group">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="z-10 inline-flex items-center rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
		>
			<div class="flex items-center">
				<CodeXml class="text-foreground-alt mr-2 size-5" />
				Code
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
		Generate with AI
	</Button>
</div>
