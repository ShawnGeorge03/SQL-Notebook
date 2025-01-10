<script lang="ts">
	import PostgreSQLIcon from '$lib/assets/db/engines/postgresql.svg?raw';
	import SQLiteIcon from '$lib/assets/db/engines/sqlite.svg?raw';
	import { DBEngine } from '$lib/db/worker/types';
	import { cn } from '$lib/utils';

	interface DatabaseIconProps {
		class?: string;
		engine: DBEngine;
	}

	let { class: className, engine }: DatabaseIconProps = $props();
</script>

{#if engine === DBEngine.PGSQL}
	<span class={cn('inline-block', className)} aria-hidden="true">{@html PostgreSQLIcon}</span>
{:else}
	<span class={cn('inline-block', className)} aria-hidden="true">{@html SQLiteIcon}</span>
{/if}
