import { expect, test, type Page } from '@playwright/test';

test.describe.serial('Storage', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto('/storage');
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('should display buckets names', async () => {
		await expect(page.getByRole('heading', { name: 'test-bucket' })).toBeVisible();
	});

	test('should display bucket file names', async () => {
		await expect(page.getByTestId('hello.txt')).toBeVisible();
	});
	
});
