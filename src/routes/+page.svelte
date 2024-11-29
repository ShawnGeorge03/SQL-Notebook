<script lang="ts">
	import type { DBWorkerResponse } from '$lib/db/worker/types';

	import { onDestroy, onMount } from 'svelte';

	let sharedWorker: SharedWorker | undefined;
	let port: MessagePort | undefined;
	onMount(() => {
		try {
			sharedWorker = new SharedWorker(new URL('$lib/db/worker/index.ts', import.meta.url), {
				type: 'module'
			});

			port = sharedWorker.port;
			port.start();

			port.onmessage = (event: MessageEvent<DBWorkerResponse>) => {
				const { status, command, response } = event.data;
				console.log(status, command, response)
			};
		} catch (e) {
			console.error(e instanceof Error ? e.message : 'Failed to start DB Worker!');
		}
	});

	onDestroy(() => {
		port?.close();
	});
</script>