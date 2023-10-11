import { expect, test, type Page } from '@playwright/test';

test.describe.serial('Database', () => {
	let page: Page;

	test.beforeEach(async ({ browser }) => {
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

	test('should synchronize item in real time', async () => {
		await page.getByRole('button', { name: 'Insert data in DB' }).click();
		await expect(page.getByTestId("realtime-item")).toHaveText('[]');
		await page.getByRole('button', { name: 'Activate realtime item' }).click();
		await expect(page.getByTestId("realtime-item")).not.toHaveText('[]');

		const text = await page.getByTestId("realtime-item").textContent();

		await page.getByRole('button', { name: 'Update data in DB' }).click();
		await expect(page.getByTestId("realtime-item")).not.toHaveText(text ?? '');

		await page.getByRole('button', { name: 'Delete data in DB' }).click();
	});

	test('should listen to db update', async () => {
		await expect(page.getByTestId("received-change")).toContainText("none");

		await page.getByRole('button', { name: 'Insert data in DB' }).click();

		await expect(page.getByTestId("received-change")).toHaveText("INSERT");

		await page.getByRole('button', { name: 'Delete data in DB' }).click();
		
	});
	
});
