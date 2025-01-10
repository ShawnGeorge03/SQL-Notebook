<script lang="ts">
	import type { Snippet } from 'svelte';

	import Copy from 'lucide-svelte/icons/copy';
	import MoveDown from 'lucide-svelte/icons/move-down';
	import MoveUp from 'lucide-svelte/icons/move-up';
	import Play from 'lucide-svelte/icons/play';
	import Trash from 'lucide-svelte/icons/trash';

	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface CellActionsProps {
		class?: String;
		moveUp: VoidFunction;
		moveDown: VoidFunction;
		copy: VoidFunction;
		run: VoidFunction;
		remove: VoidFunction;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		class: className,
		moveUp,
		moveDown,
		copy,
		run,
		remove,
		actions,
		children
	}: CellActionsProps = $props();
</script>

<div
	class={cn(
		'group relative w-[400px] rounded-t-xl bg-primary-foreground py-2 pl-3 transition-[width] duration-300 ease-in-out md:w-[500px] lg:w-[700px] xl:w-[1000px]',
		className
	)}
>
	<div
		class="absolute -top-8 right-4 flex items-center rounded-md bg-muted-foreground px-1 py-1 opacity-0 outline outline-2 outline-gray-50 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
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
		<Button
			variant="secondary"
			size="icon"
			class="border-none bg-transparent shadow-none"
			onclick={run}
		>
			<Play />
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
