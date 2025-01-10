<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { onMount } from 'svelte';

	import { Button } from '$lib/components/ui/button';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/';
	import * as Select from '$lib/components/ui/select';

	import DatabaseIcon from '$lib/components/Notebook/DatabaseIcon.svelte';
	import { DBWorkerService } from '$lib/db/worker/service';
	import { DBEngine } from '$lib/db/worker/types';

	let open = $state(false);

	let dbName = $state('');
	let engine = $state<DBEngine>(DBEngine.PGSQL);
	let persistent = $state(false);

	// svelte-ignore non_reactive_update
	let dbWorkerService: DBWorkerService;

	onMount(() => {
		dbWorkerService = DBWorkerService.getInstance();
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class="ml-auto flex aspect-square w-5 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
	>
		<Plus />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create Database</Dialog.Title>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="dbName" class="text-right">Name</Label>
				<Input id="dbName" bind:value={dbName} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="engine" class="text-right">Engine</Label>
				<Select.Root type="single" name="engine" bind:value={engine}>
					<Select.Trigger id="engine" class="col-span-3">
						<div class="flex items-center gap-4">
							<DatabaseIcon class="h-6 w-6" {engine} />
							{engine === DBEngine.PGSQL ? 'PostgreSQL' : 'SQLite'}
						</div>
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Item value={DBEngine.PGSQL}>
								{#snippet children()}
									<div class="flex items-center gap-4">
										<DatabaseIcon class="h-10 w-10" engine={DBEngine.PGSQL} />
										PostgreSQL
									</div>
								{/snippet}
							</Select.Item>
							<Select.Item value={DBEngine.SQLITE}>
								{#snippet children()}
									<div class="flex items-center gap-4">
										<DatabaseIcon class="h-10 w-10" engine={DBEngine.SQLITE} />
										SQLite
									</div>
								{/snippet}
							</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="persistent" class="text-right">Persistent</Label>
				<Checkbox id="persistent" bind:checked={persistent} class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button
				type="submit"
				disabled={!dbWorkerService || dbName.length === 0}
				onclick={() => {
					dbWorkerService.sendMessage({
						command: 'CREATE_DB',
						args: { dbName, engine, persistent }
					});
					open = false;
					dbName = '';
					engine = DBEngine.PGSQL;
					persistent = false;
				}}>Save changes</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
