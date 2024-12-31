<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Plus, RefreshCw, Trash, MinusSquare, RotateCw, File, Database } from 'lucide-svelte';
	import Separator from './ui/separator/separator.svelte';

	// Data sourced from backend
	let notebooks = [
		{ name: 'Notebook 1', id: 1 },
		{ name: 'Notebook 2', id: 2 },
		{ name: 'Notebook 3', id: 3 }
	];

	let databases = [
		{ name: 'Movies', id: 1 },
		{ name: 'Sample-Chinook', id: 2 }
	];

	// Backend actions
	async function performAction(action: string, id?: number) {
		console.log(`${action}${id ? ` for ID: ${id}` : ''}`);
		// Replace with actual backend calls
	}

	// Map actions to functions for clarity
	const actions = {
		openNotebook: (id: number) => performAction('Opening notebook', id),
		createDatabase: () => performAction('Adding a new database'),
		loadDatabase: () => performAction('Loading database'),
		closeDatabase: (id: number) => performAction('Closing database', id),
		terminateDatabase: (id: number) => performAction('Terminating database', id),
		getAllDatabases: () => performAction('Fetching all databases'),
		getActiveDatabases: () => performAction('Fetching active databases')
	};
</script>

<div class="sidebar h-screen w-80 bg-gray-900 p-4 text-white">
	<!-- Notebooks Section -->
	<Accordion.Root>
		<Accordion.AccordionItem value="notebooks">
			<Accordion.AccordionTrigger>
				<p class="float-left text-lg font-bold">Notebooks</p>
			</Accordion.AccordionTrigger>
			<Accordion.AccordionContent>
				<ul>
					{#each notebooks as { name, id }}
						<li class="mb-2 flex items-center justify-between rounded hover:bg-gray-700">
							<div class="flex space-x-2">
								<File size="20" />
								<button
									class="hover:text-orange"
									on:click={() => actions.openNotebook(id)}
									aria-label="Open Notebook"
								>
									{name}
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</Accordion.AccordionContent>
		</Accordion.AccordionItem>
	</Accordion.Root>

	<!-- Databases Section -->
	<div class="databases">
		<div class="flow-root">
			<p class="float-left mb-2 mt-2 font-bold">Databases</p>
			<div class="float-right mb-2 mt-2 flex space-x-2">
				<button
					class="hover:text-orange"
					on:click={actions.createDatabase}
					aria-label="Create Database"
				>
					<Plus size="20" />
				</button>
				<button
					class="hover:text-orange"
					on:click={actions.getAllDatabases}
					aria-label="Refresh Databases"
				>
					<RotateCw size="20" />
				</button>
			</div>
		</div>
		<ul>
			{#each databases as { name, id }}
				<li class="mb-2 flex items-center justify-between rounded hover:bg-gray-700">
					<div class="flex space-x-2">
						<Database size="20" />
						<p>{name}</p>
					</div>
					<div class="flex space-x-2">
						<button
							class="hover:text-orange"
							on:click={() => actions.terminateDatabase(id)}
							aria-label="Terminate Database"
						>
							<Trash size="20" />
						</button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
	<Separator />

	<!-- Active Databases Section -->
	<div class="active-databases">
		<div class="flow-root">
			<p class="float-left mb-2 mt-2 font-bold">Active Databases</p>
			<div class="float-right mb-2 mt-2 flex space-x-2">
				<button
					class="hover:text-orange"
					on:click={actions.loadDatabase}
					aria-label="Load Database"
				>
					<Plus size="20" />
				</button>
				<button
					class="hover:text-orange"
					on:click={actions.getActiveDatabases}
					aria-label="Refresh Active Databases"
				>
					<RotateCw size="20" />
				</button>
			</div>
		</div>
		<ul>
			{#each databases as { name, id }}
				<li class="mb-2 flex items-center justify-between rounded hover:bg-gray-700">
					<div class="flex space-x-2">
						<Database size="20" />
						<p>{name}</p>
					</div>
					<div class="flex space-x-2">
						<button
							class="hover:text-orange"
							on:click={() => actions.closeDatabase(id)}
							aria-label="Close Database"
						>
							<MinusSquare size="20" />
						</button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.sidebar button {
		background: none;
		border: none;
		cursor: pointer;
	}
	.sidebar p {
		margin: 0;
	}
</style>
