import '@testing-library/jest-dom';

import { render, fireEvent, screen } from '@testing-library/svelte';

import SizeDisplay from '../lib/SizeDisplay.svelte';

test('shows bytes under a 1000 bytes', () => {
  render(SizeDisplay, { size: 50 });
  const content = screen.getByText('50.00 B');

  expect(content).toBeInTheDocument();
});