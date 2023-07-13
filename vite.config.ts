import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import type { UserConfig as VitestConfig } from 'vitest/config';

const config: UserConfig & { test: VitestConfig['test'] } = {
	plugins: [sveltekit()],
	test: {
		// jest like globals
		threads: true,
		globals: true,
		environment: 'jsdom',
		// Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
		setupFiles: ['/tests/vitest.setup.ts'],
		include: ['src/**/*.spec.ts'],
		coverage: {
			exclude: ['./tests'],
			provider: 'v8',
			enabled: false
		},
		exclude: []
	}
};

export default config;
