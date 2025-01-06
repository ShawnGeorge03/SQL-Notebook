<script lang="ts">
	import { cn } from '$lib/utils';
	import CreateMarkdownCell from './CreateMarkdownCell.svelte';
	import CreateQueryCell from './CreateQueryCell.svelte';
	import { type CreateCellBaseProps } from './type';

	let open = $state(false);
	let { class: className, position, addNewCell }: CreateCellBaseProps = $props();
</script>

<div class={cn('m-auto flex gap-4', className)} role="group">
	<CreateQueryCell class="border border-gray-200" {position} {addNewCell} />
	<CreateMarkdownCell class="border border-gray-200" {position} {addNewCell} />
</div>
