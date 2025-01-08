<script lang="ts">
	import SelectDB from '../SelectDB.svelte';
	import { type CreateCellBaseProps } from './type';

	import QueryIcon from '$lib/assets/notebook/actions/query.svg?raw';
	import { ChevronDown } from 'lucide-svelte';

	interface CreateMarkdownCellProps extends CreateCellBaseProps {
		open?: boolean;
	}

	let {
		class: className,
		position,
		addNewCell,
		open = $bindable(false)
	}: CreateMarkdownCellProps = $props();
</script>

<SelectDB
	class={className}
	bind:open
	onSelect={(db) => addNewCell(position, { cellType: 'query', engine: db.engine, dbName: db.name })}
>
	<div class="flex items-center">
		<span class="text-foreground-alt mr-2 size-5">
			{@html QueryIcon}
		</span>
		Query

		<span class="ml-2 transition-transform duration-200 {open ? 'rotate-180' : ''}">
			<ChevronDown />
		</span>
	</div>
</SelectDB>
