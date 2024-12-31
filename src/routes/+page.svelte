<script lang="ts">
	import EditorSettings from '$lib/components/Blocks/EditorSettings.svelte';
	import TextBlock from '$lib/components/Blocks/TextBlock.svelte';
	import ActiveDBs from '$lib/components/Manager/ActiveDBs.svelte';
	import AvailableDBs from '$lib/components/Manager/AvailableDBs.svelte';
	import CloseDB from '$lib/components/Manager/CloseDB.svelte';
	import CreateDB from '$lib/components/Manager/CreateDB.svelte';
	import Demo from '$lib/components/Manager/Demo.svelte';
	import LoadDB from '$lib/components/Manager/LoadDB.svelte';
	import TerminateDB from '$lib/components/Manager/TerminateDB.svelte';
	import Notebook from '$lib/components/Notebook/Notebook.svelte';
	import Sidebar from '$lib/components/SideBar.svelte';
	import { DBWorkerService } from '$lib/db/worker/service';

	import { onMount } from 'svelte';

	let loading: boolean = $state(true);
	let markdownContent: string = $state('');

	let dbWorkerService: DBWorkerService;

	onMount(() => {
		try {
			dbWorkerService = DBWorkerService.getInstance();

			const unsubscribe = dbWorkerService.responses.subscribe((response) => {
				loading = response.status === 'INITIALIZING';
			});

			return () => {
				unsubscribe();
				dbWorkerService.disconnect();
			};
		} catch (e) {
			console.error(e instanceof Error ? e.message : 'Failed to start DB Worker!');
		}
	});
</script>

<div class="mx-36 min-h-screen">
	{#if loading}
		<p>Loading Notebook</p>
	{:else}
		<h1 class="mb-6 text-center text-2xl font-bold">Database Manager</h1>

		<div class="grid grid-cols-2 gap-4">
			<AvailableDBs />
			<ActiveDBs />
			<CreateDB />
			<LoadDB />
			<CloseDB />
			<TerminateDB />
		</div>

		<div class="mt-10">
			<Demo />
			<div class="mt-10"><EditorSettings /></div>
			<div class="mt-10 rounded-xl border-4 border-black p-10 shadow-xl">
				<h2 class="mb-5 text-center text-2xl">Markdown Content</h2>
				<TextBlock class="markdown-editor" type="markdown" bind:content={markdownContent} />
			</div>
		</div>

		<Notebook />
		<Sidebar />
	{/if}
</div>
