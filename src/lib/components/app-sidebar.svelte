<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import { RotateCw, Plus, CircleDot, MinusSquare } from 'lucide-svelte';

	import SQLiteIcon from '$lib/assets/sqlite.svg?raw';
	import PostgreSQLIcon from '$lib/assets/postgresql.svg?raw';
	import databaseIcon from '$lib/assets/database.svg?raw';

	let notebooks = [
		{ name: 'Notebook 1', id: 1 },
		{ name: 'Notebook 2', id: 2 },
		{ name: 'Notebook 3', id: 3 }
	];

	let databases = $state([
		{ name: 'Movies', id: 1, engine: 'pgsql', persistent: true, status: 'active' },
		{ name: 'Sample-Chinook', id: 2, engine: 'sqlite', persistent: true, status: 'inactive' },
		{ name: 'Sample-Chinook 2', id: 3, engine: '', persistent: false, status: '' }
	]);

	// Database Dialog
	let showDialog = $state(false);
	let newDatabaseName = $state('');
	let databaseType = $state('sqlite');
	let databasePersistence = $state('yes');

	// Function to get the icon for the database engine
	function getDatabaseIcon(engine: string) {
		switch (engine) {
			case 'pgsql':
				return PostgreSQLIcon;
			case 'sqlite':
				return SQLiteIcon;
			default:
				return databaseIcon;
		}
	}

	// Backend actions
	async function performAction(action: string, id?: number) {
		console.log(`${action}${id ? ` for ID: ${id}` : ''}`);
		// Replace with actual backend calls
	}

	// Map actions to functions for clarity
	const actions = {
		openNotebook: (id: number) => performAction('Opening notebook', id),
		refreshNotebooks: () => performAction('Refreshing notebooks list'),
		closeDatabase: (id: number) => performAction('Closing database', id),
		terminateDatabase: (id: number) => performAction('Terminating database', id),
		getAllDatabases: () => performAction('Fetching all databases'),
		getActiveDatabases: () => performAction('Fetching active databases')
	};

	function createDatabase() {
		if (newDatabaseName.trim()) {
			databases = [
				...databases,
				{
					name: newDatabaseName,
					id: databases.length + 1,
					engine: databaseType,
					persistent: databasePersistence === 'Yes',
					status: 'inactive'
				}
			];
			newDatabaseName = '';
			showDialog = false;
		}
		console.log($state.snapshot(databases));
	}
</script>

<Sidebar.Root collapsible="none" side="left">
	<Sidebar.Content class="overflow-hidden">
		<Sidebar.Group>
			<Sidebar.GroupLabel>Notebooks</Sidebar.GroupLabel>
			<Sidebar.GroupAction title="Notebook Actions" class="right-1">
				{#snippet child({ props })}
					<button onclick={actions.refreshNotebooks} {...props}>
						<RotateCw size="15" />
					</button>
				{/snippet}
			</Sidebar.GroupAction>
			<Sidebar.GroupAction title="Notebook Actions" class="right-7">
				<Plus size="15" />
			</Sidebar.GroupAction>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each notebooks as notebook}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href="notebooks/{notebook.id}" class="p-2" {...props}>
										<span>{notebook.name}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Databases</Sidebar.GroupLabel>
			<Sidebar.GroupAction title="Create Database" class="right-3">
				{#snippet child({ props })}
					<Dialog.Root>
						<button onclick={() => (showDialog = true)} {...props}>
							<Dialog.Trigger>
								<Plus size="15" />
							</Dialog.Trigger>
						</button>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Create Database</Dialog.Title>
								<div class="grid gap-4 py-4">
									<div class="grid grid-cols-4 items-center gap-4">
										<label for="Database Name" class="text-right">Name</label>
										<Input
											type="text"
											placeholder="Database Name"
											class="col-span-3 rounded-md border border-gray-300 p-2"
											bind:value={newDatabaseName}
											id="database name"
										/>
									</div>
									<div class="grid grid-cols-4 items-center gap-4">
										<label for="Database Type" class="text-right">Type</label>
										<Select.Root type="single" bind:value={databaseType}>
											<Select.Trigger class="w-[180px]"
												>{$state.snapshot(databaseType)}</Select.Trigger
											>
											<Select.Content>
												<Select.Item value="pgsql">pgsql</Select.Item>
												<Select.Item value="sqlite">sqlite</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
									<div class="grid grid-cols-4 items-center gap-4">
										<label for="Database persistence">Presistence</label>
										<Select.Root type="single" bind:value={databasePersistence}>
											<Select.Trigger class="w-[180px]"
												>{$state.snapshot(databasePersistence)}</Select.Trigger
											>
											<Select.Content>
												<Select.Item value="Yes">Yes</Select.Item>
												<Select.Item value="No">No</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
								</div>
								<button class="mt-2 rounded-md bg-blue-500 p-2 text-white" onclick={createDatabase}>
									Create
								</button>
							</Dialog.Header>
						</Dialog.Content>
					</Dialog.Root>
				{/snippet}
			</Sidebar.GroupAction>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each databases as database (database.id)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{@html getDatabaseIcon(database.engine)}
								<span class="ml-2">{database.name}</span>
								{#if database.status === 'active'}
									<CircleDot size="15" class="text-green-500" />
								{:else if database.status === 'inactive'}
									<CircleDot size="15" class="text-red-500" />
								{:else}
									<CircleDot size="15" class="text-yellow-500" />
								{/if}
								{#if database.persistent}
									<Badge variant="outline">Persistent</Badge>
								{:else}
									<Badge variant="outline">Memory</Badge>
								{/if}
							</Sidebar.MenuButton>
							<Sidebar.MenuAction>
								<MinusSquare /> <span class="sr-only">Close Database</span>
							</Sidebar.MenuAction>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
