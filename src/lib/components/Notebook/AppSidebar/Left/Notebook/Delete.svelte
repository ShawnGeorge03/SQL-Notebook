<script lang="ts">
	import Trash from 'lucide-svelte/icons/trash';

	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { deleteNotebook } from '$lib/indexeddb/notebook';

	interface DeleteNotebookProps {
		notebookID: string;
	}

	let { notebookID }: DeleteNotebookProps = $props();
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger
		class="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
	>
		<Trash /> Delete
	</AlertDialog.Trigger>
	<AlertDialog.Content class="sm:max-w-[425px]">
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the notebook and remove the data
				from your browser's storage.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				variant="destructive"
				onclick={async () => await deleteNotebook(notebookID)}
			>
				Continue
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
