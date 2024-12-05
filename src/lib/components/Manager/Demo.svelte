<script lang="ts">
	import { DBWorkerService } from '$lib/db/worker/service';
	import { nanoid } from 'nanoid/non-secure';

	let dbWorkerService = DBWorkerService.getInstance();

	const addData = async (filename: string, dbName: string) => {
		const query = await fetch(filename).then((response) => response.text());
		dbWorkerService.sendMessage({
			command: 'EXEC_QUERY',
			args: {
				dbName,
				id: nanoid(),
				query
			}
		});
	};
</script>

<div class="flex flex-col gap-4">
	<h2 class="text-lg font-semibold">Demo Databases</h2>

	<div class="flex gap-4">
		<button
			class="w-full rounded bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
			onclick={() => addData('chinook.txt', 'Chinook')}>Chinook</button
		>
		<button
			class="w-full rounded bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-900"
			onclick={() => addData('titanic.txt', 'Titanic')}>Titanic</button
		>
	</div>
</div>
