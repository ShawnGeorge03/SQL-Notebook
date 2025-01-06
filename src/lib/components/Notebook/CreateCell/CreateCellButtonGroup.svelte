<script lang="ts">
	import CreateMarkdownCell from './CreateMarkdownCell.svelte';
	import CreateQueryCell from './CreateQueryCell.svelte';
	import { type CreateCellBaseProps } from './type';

	let open = $state(false);
	let { position, addNewCell }: CreateCellBaseProps = $props();
</script>

<div class="m-auto flex gap-4" role="group">
	<CreateQueryCell class="rounded-lg border border-gray-200" {position} {addNewCell} />
	<CreateMarkdownCell class="rounded-lg border border-gray-200" {position} {addNewCell} />
</div>
