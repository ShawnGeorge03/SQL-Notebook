<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/';

	import type { Snippet } from 'svelte';

	interface NotebookNameDialogProps {
		class?: string;
		open?: boolean;
		onSave: (name: string) => Promise<void>;
		title: string;
		children: Snippet;
	}

	let {
		class: className,
		open = $bindable(false),
		onSave,
		title,
		children
	}: NotebookNameDialogProps = $props();

	let value = $state('');
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={className}>
		{@render children?.()}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
		</Dialog.Header>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="name" class="text-right">Name</Label>
			<Input id="name" bind:value class="col-span-3" />
		</div>
		<Dialog.Footer>
			<Button
				type="submit"
				onclick={async () => {
					await onSave(value);
					open = false;
					value = '';
				}}>Save changes</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
