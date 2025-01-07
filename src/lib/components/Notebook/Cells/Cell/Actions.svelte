<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { Copy, MoveDown, MoveUp, Play, Trash } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

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

<div class={cn('group relative rounded-t-xl bg-primary-foreground py-2 pl-3', className)}>
	<div
		class="absolute -top-4 right-4 flex items-center rounded-md bg-muted-foreground px-1 py-1 opacity-0 outline outline-2 outline-gray-50 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
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
