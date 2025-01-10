<script>
	import { createNotebook } from '$lib/indexeddb/notebook/utils';
	import { Plus } from 'lucide-svelte';

	import NameDialog from '../NameDialog.svelte';
</script>

<NameDialog
	class="ml-auto flex aspect-square w-5 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
	title="Create Notebook"
	onSave={async (name) => createNotebook(name)}
>
	{#snippet children()}
		<Plus />
	{/snippet}
</NameDialog>
