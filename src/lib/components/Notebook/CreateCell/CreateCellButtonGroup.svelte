<script lang="ts">
	import { cn } from '$lib/utils';
	import CreateMarkdownCell from './CreateMarkdownCell.svelte';
	import CreateQueryCell from './CreateQueryCell.svelte';
	import { type CreateCellBaseProps } from './type';

	let { class: className, position, addNewCell }: CreateCellBaseProps = $props();
	let open = $state(false);
</script>

<div
	class={cn(
		'relative flex items-center justify-center opacity-0 transition-opacity duration-200 ease-in-out hover:opacity-100',
		{
			'opacity-100': open
		},
		className
	)}
	tabindex="-1"
>
	<hr class="outline-t absolute w-full outline-muted" />
	<div class="z-10 flex gap-4">
		<div class="m-auto flex gap-4" role="group">
			<CreateQueryCell class="border border-gray-200" {position} {addNewCell} bind:open />
			<CreateMarkdownCell class="border border-gray-200" {position} {addNewCell} />
		</div>
	</div>
</div>
