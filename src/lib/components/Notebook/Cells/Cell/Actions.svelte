<script lang="ts">
	import type { Snippet } from 'svelte';

	import Copy from 'lucide-svelte/icons/copy';
	import MoveDown from 'lucide-svelte/icons/move-down';
	import MoveUp from 'lucide-svelte/icons/move-up';
	import Trash from 'lucide-svelte/icons/trash';

	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface CellActionsProps {
		class?: String;
		moveUp: VoidFunction;
		moveDown: VoidFunction;
		copy: VoidFunction;
		remove: VoidFunction;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		class: className,
		moveUp,
		moveDown,
		copy,
		remove,
		actions,
		children
	}: CellActionsProps = $props();
</script>

<div
	class={cn(
		'group relative h-fit w-[400px] rounded-t-xl bg-accent p-3 transition-[width] duration-300 ease-in-out md:w-[500px] lg:w-[700px] xl:w-[1000px]',
		className
	)}
>
	<div
		class="absolute -top-8 right-4 flex items-center rounded-md bg-primary-foreground px-1 py-1 opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100"
	>
		<Button
			variant="secondary"
			size="icon"
			class="border-none bg-transparent shadow-none"
			onclick={moveUp}
		>
			<MoveUp />
		</Button>
		<Button
			variant="secondary"
			size="icon"
			class="border-none bg-transparent shadow-none"
			onclick={moveDown}
		>
			<MoveDown />
		</Button>
		<Button
			variant="secondary"
			size="icon"
			class="border-none bg-transparent shadow-none"
			onclick={copy}
		>
			<Copy />
		</Button>

		{@render actions?.()}

		<Button
			variant="secondary"
			size="icon"
			class="border-none bg-transparent shadow-none"
			onclick={remove}
		>
			<Trash />
		</Button>
	</div>

	{@render children?.()}
</div>
