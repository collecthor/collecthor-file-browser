import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';

import RowIcon from './RowIcon.svelte';

test('show file icon with unrecognized mime type', () => {
	render(RowIcon, {
		mimeType: 'random/mimeType'
	});
	expect(document.querySelector('path')).toHaveAttribute(
		'd',
		'M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z'
	);
});

test('show file icon with image mime type', () => {
	render(RowIcon, {
		mimeType: 'image/jpeg'
	});
	expect(document.querySelector('path')).toHaveAttribute(
		'd',
		'M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z'
	);
	render(RowIcon, {
		mimeType: 'image/png'
	});
	expect(document.querySelector('path')).toHaveAttribute(
		'd',
		'M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z'
	);
});
