<script lang="ts">
	import AvailableDBs from '$lib/components/AvailableDBs.svelte';
	import { dbWorkerMessagesStore, dbWorkerResponsesStore } from '$lib/db/worker/store';
	import type { DBWorkerResponse } from '$lib/db/worker/types';

	import { onDestroy, onMount } from 'svelte';

	let sharedWorker: SharedWorker | undefined;
	let port: MessagePort | undefined;
	let loading: boolean = $state(true);

	onMount(() => {
		try {
			sharedWorker = new SharedWorker(new URL('$lib/db/worker/index.ts', import.meta.url), {
				type: 'module'
			});

			port = sharedWorker.port;
			port.start();

			port.onmessage = (event: MessageEvent<DBWorkerResponse>) => {
				if (event.data.status === 'READY') loading = false;
				dbWorkerResponsesStore.set(event.data);
			};

			dbWorkerMessagesStore.subscribe(message => {
				if (!port) return;
				port.postMessage(message);
			})


		} catch (e) {
			console.error(e instanceof Error ? e.message : 'Failed to start DB Worker!');
		}
	});

	onDestroy(() => {
		port?.close();
	});
</script>

<div class="container mx-auto">
	{#if loading}
		<p>Loading Notebook</p>
	{:else}
		<h1 class="mb-6 text-center text-2xl font-bold">Database Manager</h1>

		<div class="grid grid-cols-2 gap-4">
			<AvailableDBs />
		</div>

	{/if}
</div>