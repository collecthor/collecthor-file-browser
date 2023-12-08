/* eslint-disable @typescript-eslint/no-empty-function */
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import type { Navigation, Page } from '@sveltejs/kit';
import { readable } from 'svelte/store';
import type * as environment from '$app/environment';
import type * as navigation from '$app/navigation';
import type * as stores from '$app/stores';

// Mock SvelteKit runtime module $app/environment
vi.mock('$app/environment', (): typeof environment => ({
	browser: false,
	dev: true,
	building: false,
	version: 'any'
}));

// Mock SvelteKit runtime module $app/navigation
vi.mock('$app/navigation', (): typeof navigation => ({
	afterNavigate: () => {},
	onNavigate: () => {},
	beforeNavigate: () => {},
	disableScrollHandling: () => {},
	goto: async () => void 0,
	invalidate: async () => void 0,
	invalidateAll: async () => void 0,
	preloadData: async () => void 0,
	preloadCode: async () => void 0
}));

// Mock SvelteKit runtime module $app/stores
vi.mock('$app/stores', (): typeof stores => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const getStores: typeof stores.getStores = () => {
		const navigating = readable<Navigation | null>(null);
		const page = readable<Page>({
			url: new URL('http://localhost'),
			params: {},
			route: {
				id: null
			},
			status: 200,
			error: null,
			data: {},
			form: undefined
		});
		const updated = { subscribe: readable(false).subscribe, check: () => false };

		return { navigating, page, updated };
	};

	const page: typeof stores.page = {
		subscribe(fn) {
			return getStores().page.subscribe(fn);
		}
	};
	const navigating: typeof stores.navigating = {
		subscribe(fn) {
			return getStores().navigating.subscribe(fn);
		}
	};
	const updated: typeof stores.updated = {
		subscribe(fn) {
			return getStores().updated.subscribe(fn);
		},
		async check() {
			return false;
		}
	};

	return {
		getStores,
		navigating,
		page,
		updated
	};
});
