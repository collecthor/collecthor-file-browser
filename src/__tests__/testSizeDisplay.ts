import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/svelte";

import SizeDisplay from "$lib/SizeDisplay.svelte";

test("shows bytes under a 1000 bytes", () => {
  render(SizeDisplay, { size: 50 });
  const size = screen.getByText("50 B");
  expect(size).toBeInTheDocument();
});

test("shows kilobytes under 1000000 bytes", () => {
  render(SizeDisplay, { size: 12344 });
  const size = screen.getByText("12 KB");
  expect(size).toBeInTheDocument();
});

test("shows megabytes under 1000000000 bytes", () => {
  render(SizeDisplay, { size: 12340000 });
  const size = screen.getByText("12.34 MB");
  expect(size).toBeInTheDocument();
});

test("shows gigabytes under 1000000000000 bytes", () => {
  render(SizeDisplay, { size: 12340000000 });
  const size = screen.getByText("12.34 GB");
  expect(size).toBeInTheDocument();
});

test("shows terabytes under 1000000000000000 bytes", () => {
  render(SizeDisplay, { size: 12340000000000 });
  const size = screen.getByText("12.34 TB");
  expect(size).toBeInTheDocument();
});
