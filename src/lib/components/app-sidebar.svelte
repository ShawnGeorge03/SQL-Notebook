<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import { Plus, CircleDot, Ellipsis } from 'lucide-svelte';

	import SQLiteIcon from '$lib/assets/sqlite.svg?raw';
	import PostgreSQLIcon from '$lib/assets/postgresql.svg?raw';
	import databaseIcon from '$lib/assets/database.svg?raw';
	import Button from './ui/button/button.svelte';

	let notebooks = $state([
		{ name: 'Notebook 1', id: 1 },
		{ name: 'Notebook 2', id: 2 },
		{ name: 'Notebook 3', id: 3 }
	]);

	let databases = $state([
		{ name: 'Movies', id: 1, engine: 'pgsql', persistent: true, status: 'active' },
		{ name: 'Sample-Chinook', id: 2, engine: 'sqlite', persistent: true, status: 'inactive' },
		{ name: 'Sample-Chinook 2', id: 3, engine: '', persistent: false, status: '' }
	]);

	// Database Dialogs
	let showCreateDBDialog = $state(false);
	let showDBActionsDialog = $state(false);
	let newDatabaseName = $state('');
	let databaseType = $state('sqlite');
	let databasePersistence = $state('yes');

	// Notebook Dialog
	let showCreateNBDialog = $state(false);
	let newNotebookName = $state('');

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
		terminateDatabase: (id: number) => performAction('Terminating database', id)
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
			showCreateDBDialog = false;
		}
		console.log($state.snapshot(databases));
	}

	function createNotebook() {
		if (newNotebookName.trim()) {
			notebooks = [
				...notebooks,
				{
					name: newNotebookName,
					id: notebooks.length + 1
				}
			];
			newNotebookName = '';
			showCreateNBDialog = false;
		}
		console.log($state.snapshot(notebooks));
	}
</script>

<Sidebar.Root collapsible="none" side="left">
	<Sidebar.Content class="overflow-hidden">
		<Sidebar.Group>
			<Sidebar.GroupLabel>Notebooks</Sidebar.GroupLabel>
			<Sidebar.GroupAction title="Create Notebook" class="right-3">
				{#snippet child({ props })}
					<Dialog.Root>
						<button onclick={() => (showCreateNBDialog = true)} {...props}>
							<Dialog.Trigger>
								<Plus size="15" />
							</Dialog.Trigger>
						</button>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Create Notebook</Dialog.Title>
							</Dialog.Header>
							<div class="grid gap-4 py-4">
								<div class="grid grid-cols-4 items-center gap-4">
									<label for="Notebook Name" class="text-right">Name</label>
									<Input
										type="text"
										placeholder="Notebook Name"
										class="col-span-3 rounded-md border border-gray-300 p-2"
										bind:value={newNotebookName}
										id="Notebook Name"
									/>
								</div>
							</div>
							<button class="rounded-md bg-blue-500 p-2 text-white" onclick={createNotebook}>
								Create
							</button>
						</Dialog.Content>
					</Dialog.Root>
				{/snippet}
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
						<button onclick={() => (showCreateDBDialog = true)} {...props}>
							<Dialog.Trigger>
								<Plus size="15" />
							</Dialog.Trigger>
						</button>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Create Database</Dialog.Title>
							</Dialog.Header>
							<div class="grid gap-4 py-4">
								<div class="grid grid-cols-4 items-center gap-4">
									<label for="Database Name" class="text-right">Name</label>
									<Input
										type="text"
										placeholder="Database Name"
										class="col-span-3 rounded-md border border-gray-300 p-2"
										bind:value={newDatabaseName}
										id="Database Name"
									/>
								</div>
								<div class="grid grid-cols-4 items-center gap-4">
									<label for="Database Type" class="text-right">Type</label>
									<Select.Root type="single" bind:value={databaseType}>
										<Select.Trigger class="w-[180px]"
											>{$state.snapshot(databaseType)}</Select.Trigger
										>
										<Select.Content id="Database Type">
											<Select.Item value="pgsql">pgsql</Select.Item>
											<Select.Item value="sqlite">sqlite</Select.Item>
										</Select.Content>
									</Select.Root>
								</div>
								<div class="grid grid-cols-4 items-center gap-4">
									<label for="Database persistence" class="text-right">Presistent</label>
									<Select.Root type="single" bind:value={databasePersistence}>
										<Select.Trigger class="w-[180px]"
											>{$state.snapshot(databasePersistence)}</Select.Trigger
										>
										<Select.Content id="Database persistence">
											<Select.Item value="Yes">Yes</Select.Item>
											<Select.Item value="No">No</Select.Item>
										</Select.Content>
									</Select.Root>
								</div>
							</div>
							<button class="mt-2 rounded-md bg-blue-500 p-2 text-white" onclick={createDatabase}>
								Create
							</button>
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
								{#snippet child({ props })}
									<Dialog.Root>
										<button onclick={() => (showDBActionsDialog = true)} {...props}>
											<Dialog.Trigger>
												<Ellipsis size="15" />
											</Dialog.Trigger>
											<Dialog.Content>
												<Dialog.Header>
													<Dialog.Title>Database Actions</Dialog.Title>
													<div class="my-2 border-t border-gray-200">
														<div class="grid gap-4 py-4">
															<p class="text-grey">Database Name: {database.name}</p>
															<p class="text-grey">Database Engine: {database.engine}</p>
															<p class="text-grey">Database Status: {database.status}</p>
														</div>
													</div></Dialog.Header
												>
												<Button
													class="w-full text-center"
													onclick={() => actions.closeDatabase(database.id)}
												>
													Close
												</Button>
												{#if database.status === 'active'}
													<Button
														class="w-full p-2 text-center"
														onclick={() => actions.terminateDatabase(database.id)}
													>
														Terminate
													</Button>
												{/if}
											</Dialog.Content>
										</button>
									</Dialog.Root>
								{/snippet}
							</Sidebar.MenuAction>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
