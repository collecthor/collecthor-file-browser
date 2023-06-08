import { expect, test } from '@playwright/test';
test('correctly loads the index page', async ({ page }) => {
	await page.goto(`/`);
	await expect(page.locator('css=.file-browser')).toBeVisible();
});
