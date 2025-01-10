<script lang="ts">
	import { Plus } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/';
	import { cn } from '$lib/utils';

	import { createNotebook } from '$lib/indexeddb/notebook';

	interface CreateNotebookDialogProps {
		class?: string;
		open?: boolean;
	}

	let { class: className, open = $bindable(false) }: CreateNotebookDialogProps = $props();
	let value = $state('');
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={cn(
			'flex w-5 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
			className
		)}
	>
		<Plus />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create New Notebook</Dialog.Title>
		</Dialog.Header>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="name" class="text-right">Name</Label>
			<Input id="name" bind:value class="col-span-3" />
		</div>
		<Dialog.Footer>
			<Button
				type="submit"
				onclick={async () => {
					await createNotebook(value);
					open = false;
					value = '';
				}}
			>
				Create
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
