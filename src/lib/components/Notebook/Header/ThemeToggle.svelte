<script lang="ts">
	import { mode, resetMode, setMode } from 'mode-watcher';

	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';

	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';

	export interface ThemeProps {
		class?: string;
	}

	const { class: className }: ThemeProps = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(buttonVariants({ variant: 'outline' }), className, 'h-7 w-7 p-0')}
	>
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item
			onclick={() => {
				setMode('light');
				document.body.setAttribute('data-theme', 'light');
			}}>Light</DropdownMenu.Item
		>
		<DropdownMenu.Item
			onclick={() => {
				setMode('dark');
				document.body.setAttribute('data-theme', 'dark');
			}}>Dark</DropdownMenu.Item
		>
		<DropdownMenu.Item
			onclick={() => {
				resetMode();
				document.body.setAttribute('data-theme', $mode as string);
			}}>System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
