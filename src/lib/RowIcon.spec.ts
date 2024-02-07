import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';

import RowIcon from './RowIcon.svelte';

test('show file icon with unrecognized mime type', () => {
	render(RowIcon, {
		iconUrl: null,
		mimeType: 'random/mimeType'
	});
	expect(document.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
});

test('show file icon with image mime type', () => {
	render(RowIcon, {
		iconUrl: null,
		mimeType: 'image/jpeg'
	});
	expect(document.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');

	render(RowIcon, {
		iconUrl: null,
		mimeType: 'image/png'
	});
	expect(document.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
});
