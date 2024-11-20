import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { configDefaults, type ViteUserConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

const config: UserConfig & { test: ViteUserConfig } = {
	plugins: [
		sveltekit(),
		svelteTesting(),
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
		environmentOptions: {
			jsdom: {
				resources: 'usable',
				runScripts: 'dangerously'
			}
		},
		// Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
		setupFiles: ['/tests/vitest.setup.ts'],
		include: ['src/**/*.spec.ts'],
		coverage: {
			exclude: ['./tests'],
			provider: 'v8',
			enabled: false
		},
		exclude: [...configDefaults.exclude, 'tests', '.svelte-kit']
	}
};

export default config;
