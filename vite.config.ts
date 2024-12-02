import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';

const DBWorkerWatcher = (): PluginOption => {
	return {
		name: 'db-worker-watcher',
		enforce: 'post',
		handleHotUpdate({ file, server }) {
			if (file.endsWith('worker/index.ts'))
				server.restart();
		}

	}
}

export default defineConfig({
	plugins: [sveltekit(), DBWorkerWatcher()],
	worker: {
		format: 'es'
	},
	optimizeDeps: {
		exclude: ['@electric-sql/pglite']
	}
});
