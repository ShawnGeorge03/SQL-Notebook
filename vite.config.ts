import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	worker: {
		format: 'es'
	},
	optimizeDeps: {
		exclude: ['@electric-sql/pglite', 'wa-sqlite']
	}
});
