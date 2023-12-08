// vite.js.config.ts
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	base: '',
	build: {
		minify: false,
		rollupOptions: {
			output: {
				inlineDynamicImports: true
			}
		},
		lib: {
			entry: resolve(__dirname, 'dist/index.js'),
			name: 'Components',
			fileName: 'components'
		},
		outDir: 'browser'
	},
	plugins: [svelte()]
});
