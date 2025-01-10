<script lang="ts">
	import CircleDot from 'lucide-svelte/icons/circle-dot.svelte';
	import Info from 'lucide-svelte/icons/info.svelte';

	import * as Dialog from '$lib/components/ui/dialog/';
	import { Label } from '$lib/components/ui/label/';
	import { DBEngine } from '$lib/db/worker/types';
	import type { Database } from '$lib/indexeddb/types';

	import DatabaseIcon from '$lib/components/Notebook/DatabaseIcon.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	interface InfoNotebookProps {
		database: Database;
	}

	let { database }: InfoNotebookProps = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
	>
		<Info class="ml-1" /> Info
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
				<p class="col-span-3 flex items-center gap-2">
					<DatabaseIcon class="h-6 w-6" engine={database.engine} />
					{database.engine === DBEngine.PGSQL ? 'PostgreSQL' : 'SQLite'}
				</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Persistent:</Label>
				<p class="col-span-3">
					{database.persistent ? 'Yes' : 'No'}
				</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Status:</Label>
				<p class="col-span-3 flex items-center gap-2">
					{database.status.slice(0, 1) + database.status.slice(1).toLowerCase()}
					{#if database.status === 'AVAILABLE'}
						<CircleDot size="15" class="text-green-500" />
					{:else if database.status === 'LOADING'}
						<CircleDot size="15" class="text-yellow-500" />
					{:else if database.status === 'UNAVAILABLE'}
						<CircleDot size="15" class="text-red-500" />
					{/if}
				</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Powered By:</Label>
				<p class="col-span-3">
					{#if database.system === 'pglite'}
						<Button
							variant="link"
							size="icon"
							href="https://pglite.dev/"
							target="_blank"
							rel="noopener noreferrer">PGLite</Button
						>
					{:else if database.system === 'wa-sqlite'}
						<Button
							variant="link"
							size="icon"
							href="https://github.com/rhashimoto/wa-sqlite"
							target="_blank"
							rel="noopener noreferrer">wa-sqlite</Button
						>
					{/if}
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
