<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

	interface AlertDialogActionProps extends AlertDialogPrimitive.ActionProps {
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		size?: 'default' | 'sm' | 'lg' | 'icon';
	}

	let {
		class: className,
		ref = $bindable(null),
		variant = 'default',
		size = 'default',
		...restProps
	}: AlertDialogActionProps = $props();
</script>

<AlertDialogPrimitive.Action
	bind:ref
	class={cn(buttonVariants({ variant, size }), className)}
	{...restProps}
/>
