<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import { dev } from '$app/environment';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import '../app.css';

	if (!dev) injectSpeedInsights();

	let { children } = $props();
</script>

<ModeWatcher modeStorageKey="mode" />
{@render children?.()}
