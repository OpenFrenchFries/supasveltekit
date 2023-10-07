import { expect, test, type Page } from '@playwright/test';

test.describe.parallel('Database', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto('/database');
		await page.waitForLoadState('networkidle');
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('should list entries and receive realtime updates', async () => {
		await page.waitForSelector(".items-count");
		const count = +(await (page.getByTestId("items-count").textContent()) ?? '0');
		await page.getByRole('button', { name: 'Insert data in DB' }).click();
		await expect(page.getByTestId("items-count")).toHaveText((count + 1).toString());

		const createdAt = await page.locator(".items").first().textContent();
		await page.getByRole('button', { name: 'Update data in DB' }).click();
		await expect(page.locator(".items").first()).not.toHaveText(createdAt ?? '');

		await page.getByRole('button', { name: 'Delete data in DB' }).click();
		await expect(page.getByTestId("items-count")).toHaveText(count.toString());
	});
	
});
