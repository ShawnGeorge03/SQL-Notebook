<script lang="ts">
	import { Pencil } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/';

	import { renameNotebook } from '$lib/indexeddb/notebook';

	interface RenameNotebookDialogProps {
		class?: string;
		notebookID: string;
		open?: boolean;
	}

	let {
		class: className,
		notebookID,
		open = $bindable(false)
	}: RenameNotebookDialogProps = $props();

	let value = $state('');
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
	>
		<Pencil /> Rename
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Rename Notebook</Dialog.Title>
		</Dialog.Header>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="name" class="text-right">Name</Label>
			<Input id="name" bind:value class="col-span-3" />
		</div>
		<Dialog.Footer>
			<Button
				type="submit"
				onclick={async () => {
					await renameNotebook(notebookID, value);
					open = false;
					value = '';
				}}>Rename</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
