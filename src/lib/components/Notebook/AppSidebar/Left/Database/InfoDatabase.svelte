<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/';
	import { Label } from '$lib/components/ui/label/';
	import type { Database } from '$lib/indexeddb/types';

	import { Info } from 'lucide-svelte';

	interface InfoNotebookProps {
		database: Database;
	}

	let { database }: InfoNotebookProps = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
	>
		<Info /> Info
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Database Information</Dialog.Title>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name:</Label>
				<p class="col-span-3">{database.name}</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Engine:</Label>
				<p class="col-span-3">
					{database.engine}
				</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Persistent:</Label>
				<p class="col-span-3">
					{database.persistent}
				</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Powered By:</Label>
				<p class="col-span-3">
					{database.system}
				</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Created On:</Label>
				<p class="col-span-3">
					{new Date(database.createdOn).toLocaleDateString()}
					{new Date(database.createdOn).toLocaleTimeString()}
				</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Modified On:</Label>
				<p class="col-span-3">
					{new Date(database.modifiedOn).toLocaleDateString()}
					{new Date(database.modifiedOn).toLocaleTimeString()}
				</p>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
