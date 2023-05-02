import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
// import { configDefaults, type UserConfig as VitestConfig } from 'vitest/config';

const config: UserConfig = {
	plugins: [sveltekit()],
	define: {
		// Eliminate in-source test code
		'import.meta.vitest': 'undefined'
	}
};

export default config;
