import { expect, test, type Page } from '@playwright/test';

test.describe.parallel('DB Changes', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto('/realtime');
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('should listen to db update', async () => {
		await expect(page.getByTestId("received-change")).toContainText("none");

		await page.getByRole('button', { name: 'Insert data in DB' }).click();

		await expect(page.getByTestId("received-change")).toHaveText("INSERT");
		
	});
	
});
