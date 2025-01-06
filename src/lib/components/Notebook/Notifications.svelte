<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { DBWorkerService } from '$lib/db/worker/service';
	import type { DBWorkerCommand } from '$lib/db/worker/types';
	import { cn } from '$lib/utils';
	import { useId } from 'bits-ui';
	import { onMount } from 'svelte';

	import CloseDBIcon from '$lib/assets/db/actions/close-db.svg?raw';
	import CreateDBIcon from '$lib/assets/db/actions/create-db.svg?raw';
	import LoadDBIcon from '$lib/assets/db/actions/load-db.svg?raw';
	import QueryDBIcon from '$lib/assets/db/actions/query-db.svg?raw';
	import TerminateDBIcon from '$lib/assets/db/actions/terminate-db.svg?raw';
	import { Bell } from 'lucide-svelte';

	interface Notification {
		id: string;
		status: 'SUCCESS' | 'ERROR';
		command: DBWorkerCommand;
		title: string;
		description: string;
	}

	let dbWorkerService: DBWorkerService;
	let notifications: Notification[] = $state<Notification[]>([]);

	const successNotifications = {
		CREATE_DB: (dbName: string) => ({
			title: 'Successfully Created Database',
			description: `Database ${dbName} has been created successfully.`
		}),
		LOAD_DB: (dbName: string) => ({
			title: 'Successfully Loaded Database',
			description: `Database ${dbName} has been loaded successfully.`
		}),
		EXEC_QUERY: (elapsed: number) => ({
			title: 'Successfully Executed Query',
			description: `Query has been executed successfully in ${elapsed} ms`
		}),
		CLOSE_DB: (dbName: string) => ({
			title: 'Successfully Closed Database',
			description: `Database ${dbName} has been closed successfully.`
		}),
		TERMINATE_DB: (dbName: string) => ({
			title: 'Successfully Terminated Database',
			description: `Database ${dbName} has been terminated successfully.`
		})
	};

	const errorNotifications = {
		CREATE_DB: (message: string) => ({
			title: 'Failed to create Database',
			description: message
		}),
		LOAD_DB: (message: string) => ({
			title: 'Failed to load Database',
			description: message
		}),
		EXEC_QUERY: (cause: string) => ({
			title: 'Failed to execute Query',
			description: cause
		}),
		CLOSE_DB: (message: string) => ({
			title: 'Failed to close Database',
			description: message
		}),
		TERMINATE_DB: (message: string) => ({
			title: 'Failed to terminate Database',
			description: message
		})
	};

	onMount(() => {
		dbWorkerService = DBWorkerService.getInstance();

		const unsubscribe = dbWorkerService.responses.subscribe((response) => {
			if (response.status === 'SUCCESS') {
				switch (response.command) {
					case 'CREATE_DB':
					case 'LOAD_DB':
					case 'CLOSE_DB':
					case 'TERMINATE_DB':
						notifications.push({
							id: useId(),
							status: response.status,
							command: response.command,
							...successNotifications[response.command](response.data.dbName)
						});
						break;
					case 'EXEC_QUERY':
						notifications.push({
							id: useId(),
							status: response.status,
							command: response.command,
							...successNotifications[response.command](response.data.elapsed)
						});
						break;
				}
			} else if (response.status === 'ERROR') {
				switch (response.command) {
					case 'CREATE_DB':
					case 'LOAD_DB':
					case 'CLOSE_DB':
					case 'TERMINATE_DB':
						notifications.push({
							id: useId(),
							status: response.status,
							command: response.command,
							...errorNotifications[response.command](response.data.message)
						});
						break;
					case 'EXEC_QUERY':
						notifications.push({
							id: useId(),
							status: response.status,
							command: response.command,
							...errorNotifications[response.command](response.data.cause as string)
						});
						break;
				}
			}
		});

		() => {
			unsubscribe();
		};
	});
</script>

<DropdownMenu.Root onOpenChange={(isOpen) => !isOpen && (notifications = [])}>
	<DropdownMenu.Trigger>
		<div class="relative">
			<Bell class="h-6 w-6" />
			{#if notifications.length > 0}
				<div
					class="absolute right-0 top-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white"
				>
					{notifications.length}
				</div>
			{/if}
		</div>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="p-0" preventScroll>
		<ScrollArea class={cn('w-[20rem] rounded-md p-2', { 'h-60': notifications.length > 5 })}>
			{#if notifications.length === 0}
				<DropdownMenu.Item>
					<p class="m-auto text-sm text-gray-500">No notifications</p>
				</DropdownMenu.Item>
			{/if}
			{#each notifications as { id, status, command, title, description }, index (id)}
				<DropdownMenu.Item>
					<span
						class={cn('flex h-8 w-8 items-center justify-center rounded-full', {
							'bg-green-500': status === 'SUCCESS',
							'bg-red-500': status === 'ERROR'
						})}
					>
						{#if command === 'CREATE_DB'}
							<span class="h-6 w-6 text-white">{@html CreateDBIcon}</span>
						{:else if command === 'LOAD_DB'}
							<span class="h-6 w-6 text-white">{@html LoadDBIcon}</span>
						{:else if command === 'EXEC_QUERY'}
							<span class="h-6 w-6 text-white">{@html QueryDBIcon}</span>
						{:else if command === 'CLOSE_DB'}
							<span class="h-6 w-6 text-white">{@html CloseDBIcon}</span>
						{:else if command === 'TERMINATE_DB'}
							<span class="h-6 w-6 text-white">{@html TerminateDBIcon}</span>
						{/if}
					</span>
					<div>
						<h3 class="text-sm font-semibold">{title}</h3>
						<p class="text-xs text-gray-500">{description}</p>
					</div>
				</DropdownMenu.Item>
				{#if index < notifications.length - 1}
					<DropdownMenu.Separator />
				{/if}
			{/each}
		</ScrollArea>
	</DropdownMenu.Content>
</DropdownMenu.Root>
