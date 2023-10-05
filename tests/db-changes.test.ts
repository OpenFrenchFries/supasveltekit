import { expect, test, type Page } from '@playwright/test';

test.describe.parallel('DB Changes', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto('/realtime');
		await page.waitForLoadState('networkidle');
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('should listen to db update', async () => {
		await expect(page.getByTestId("received-change")).toContainText("none");

		await page.getByRole('button', { name: 'Insert data in DB' }).click({delay: 1000});

		await expect(page.getByTestId("received-change")).toHaveText("INSERT");
		
	});
	
});
