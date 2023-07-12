import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';

import RowIcon from './RowIcon.svelte';

test('show file icon with unrecognized mime type', () => {
	render(RowIcon, {
		iconUrl: null,
		mimeType: 'random/mimeType'
	});
	expect(document.querySelector('use')).toHaveAttribute('href', '#mdiFile');
});

test('show file icon with image mime type', () => {
	render(RowIcon, {
		iconUrl: null,
		mimeType: 'image/jpeg'
	});
	expect(document.querySelector('use')).toHaveAttribute('href', '#mdiFileImage');

	render(RowIcon, {
		iconUrl: null,
		mimeType: 'image/png'
	});
	expect(document.querySelector('use')).toHaveAttribute('href', '#mdiFileImage');
});
