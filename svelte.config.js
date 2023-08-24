import sveltePreprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

export default {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: true,
			strict: false
		}),
		paths: {
			base: process.env.GITHUB_ACTION
				? process.env.GITHUB_REPOSITORY.replace(/^[^/]+\//gi, '/')
				: ''
		}
	}
};
