<script lang="ts">
	import { renameNotebook } from '$lib/indexeddb/notebook/utils';
	import { Pencil } from 'lucide-svelte';

	import NameDialog from '../NameDialog.svelte';

	interface RenameNotebookProps {
		id: string;
	}

	let { id }: RenameNotebookProps = $props();
</script>

<NameDialog
	class="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
	title="Rename Notebook"
	onSave={async (name) => renameNotebook(id, name)}
>
	{#snippet children()}
		<Pencil /> Rename
	{/snippet}
</NameDialog>
