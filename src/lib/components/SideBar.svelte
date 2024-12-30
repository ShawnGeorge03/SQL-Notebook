<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';

	// Source this from the backend
	let notebooks = ['Notebook 1', 'Notebook 2', 'Notebook 3'];
	let notebook_refs = ['Notebook 1', 'Notebook 2', 'Notebook 3'];
	let databases = [
		{ name: 'Movies', id: 1 },
		{ name: 'Sample-Chinook', id: 2 }
	];

	// Mock actions for refresh and add

	function createDatabase() {
		console.log('Adding a new database...');
	}

	async function loadDatabase(databaseId: number) {
		console.log(`Loading database with ID: ${databaseId}`);
		// Call your backend here
	}

	async function closeDatabase(databaseId: number) {
		console.log(`Closing database with ID: ${databaseId}`);
		// Call your backend here
	}

	async function refreshDatabases() {
		console.log('Refreshing databases...');
		// Call your backend here to fetch the latest database list
	}

	async function terminateDatabase(databaseId: number) {
		console.log(`Terminating database with ID: ${databaseId}`);
		// Call your backend here
	}
</script>

<div class="sidebar h-screen w-60 bg-gray-900 p-4 text-white">
	<!-- Notebooks Section -->
	<Accordion.Root>
		<Accordion.AccordionItem value="notebooks">
			<Accordion.AccordionTrigger>Notebooks</Accordion.AccordionTrigger>
			<Accordion.AccordionContent>
				<ul>
					{#each notebooks as notebook}
						<li class="mb-1">
							<Button class="w-full rounded p-2 text-left hover:bg-gray-700">{notebook}</Button>
						</li>
					{/each}
				</ul>
			</Accordion.AccordionContent>
		</Accordion.AccordionItem>
	</Accordion.Root>

	<!--Databases Section-->
	<div class="databases">
		<h2 class="mb-2 text-lg font-bold">Databases</h2>
		<ul>
			{#each databases as database}
				<li class="mb-2 flex items-center justify-between rounded p-2 hover:bg-gray-700">
					<span>{database.name}</span>
					<div class="flex space-x-2">
						<button
							class="p-2 text-green-500 hover:text-white"
							on:click={() => loadDatabase(database.id)}
							aria-label="Open database"
						>
							<i class="icon icon-open">Open</i>
						</button>
						<button
							class="p-2 text-red-500 hover:text-white"
							on:click={() => closeDatabase(database.id)}
							aria-label="Delete database"
						>
							<i class="icon icon-delete">Delete</i>
						</button>
					</div>
				</li>
			{/each}
		</ul>
		<div class="mt-4 flex space-x-2">
			<button
				class="rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
				on:click={createDatabase}
			>
				Add
			</button>
			<button
				class="rounded bg-gray-600 p-2 text-white hover:bg-gray-700"
				on:click={refreshDatabases}
			>
				Refresh
			</button>
		</div>
	</div>
</div>
