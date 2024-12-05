<script lang="ts">
	import { dev } from '$app/environment';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import '../app.css';

	if (!dev) injectSpeedInsights();

	let { children } = $props();
</script>

{@render children()}
