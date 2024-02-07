import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import type { UserConfig as VitestConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';

const config: UserConfig & { test: VitestConfig['test'] } = {
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	build: {
		minify: true
	},
	test: {
		// jest like globals
		globals: true,
		environment: 'jsdom',
		// Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
		setupFiles: ['/tests/vitest.setup.ts'],
		include: ['src/**/*.spec.ts'],
		coverage: {
			exclude: ['./tests'],
			provider: 'v8',
			enabled: false
		}
	}
};

export default config;
