<script lang="ts">
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import SidebarLeft from '$lib/components/ui/sidebar/sidebar-left.svelte';
</script>

<Sidebar.Provider>
	<SidebarLeft />
	<Sidebar.Inset>
		<main class="space-y-4 bg-green-500">
			<header class="sticky top-0 z-10 bg-red-500 p-4">
				<Sidebar.Trigger />
				<div class="float-right flex justify-end gap-4">
					<SettingsModal />
				</div>
			</header>
			<p class="h-[512px] bg-purple-500 p-4">Paragraph 1</p>
			<p class="h-[512px] bg-purple-500 p-4">Paragraph 2</p>
			<p class="h-[512px] bg-purple-500 p-4">Paragraph 3</p>
			<p class="h-[512px] bg-purple-500 p-4">Paragraph 4</p>
			<p class="h-[512px] bg-purple-500 p-4">Paragraph 5</p>
			<p class="h-[512px] bg-purple-500 p-4">Paragraph 6</p>
			<footer class="sticky bottom-0 z-10 bg-blue-500 p-4">(footer)</footer>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
