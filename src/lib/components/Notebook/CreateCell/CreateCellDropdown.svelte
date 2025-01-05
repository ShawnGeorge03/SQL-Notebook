<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import CreateCellDropdownContent from './CreateCellDropdownContent.svelte';
	import { type CreateCellBaseProps } from './type';

	import MarkdownIcon from '$lib/assets/notebook/actions/markdown.svg?raw';
	import QueryIcon from '$lib/assets/notebook/actions/query.svg?raw';

	import { Plus } from 'lucide-svelte';

	let { position, addNewCell }: CreateCellBaseProps = $props();
</script>

<div
	class="flex items-center justify-between p-1 opacity-0 transition-opacity duration-200 ease-in-out focus-within:opacity-100 hover:opacity-100"
>
	<hr class="h-0.5 w-1/2 border-0 bg-muted-foreground" />

	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="duration-250 mx-1 inline-flex h-6 w-6 select-none items-center justify-center rounded-full text-sm font-medium transition-[background-color] ease-linear hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger><Plus class="h-6 w-6 text-muted-foreground" /></Tooltip.Trigger>
					<Tooltip.Content>
						<p>Click to add a new cell</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content
			class="focus-override w-20 rounded-xl border border-muted bg-background px-1 py-1.5 outline-none focus-visible:outline-none"
		>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger
					class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
				>
					<div class="flex items-center">
						<span class="text-foreground-alt mr-2 size-6">
							{@html QueryIcon}
						</span>
						Query
					</div>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent
					class=" h-fit w-52 rounded-xl border border-muted bg-background px-1 py-1.5 !ring-0 !ring-transparent"
					sideOffset={10}
				>
					<CreateCellDropdownContent {position} {addNewCell} />
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Item
				onclick={() => addNewCell(position, { cellType: 'markdown' })}
				class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
			>
				<div class="flex items-center">
					<span class="text-foreground-alt mr-2 size-6">
						{@html MarkdownIcon}
					</span>
					Markdown
				</div>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<hr class=" h-0.5 w-1/2 border-0 bg-muted-foreground" />
</div>
