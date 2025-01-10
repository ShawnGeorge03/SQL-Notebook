<script lang="ts">
	import Info from 'lucide-svelte/icons/info';

	import * as Dialog from '$lib/components/ui/dialog/';
	import { Label } from '$lib/components/ui/label/';

	import type { NotebookStore } from '$lib/indexeddb/notebook';

	interface InfoNotebookProps {
		notebook: NotebookStore;
	}

	let { notebook }: InfoNotebookProps = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
	>
		<Info /> Info
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Notebook Information</Dialog.Title>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name:</Label>
				<p class="col-span-3">{notebook.name}</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Created On:</Label>
				<p class="col-span-3">
					{new Date(notebook.createdOn).toLocaleDateString()}
					{new Date(notebook.createdOn).toLocaleTimeString()}
				</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Modified On:</Label>
				<p class="col-span-3">
					{new Date(notebook.modifiedOn).toLocaleDateString()}
					{new Date(notebook.modifiedOn).toLocaleTimeString()}
				</p>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
