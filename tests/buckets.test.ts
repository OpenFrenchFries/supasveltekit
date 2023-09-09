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

	test('Should show a bucket named avatars after creation', async () => {
		await page.waitForSelector('[data-testid="bucket-name"]');
		const linksCount = await page.getByTestId("bucket-name").count();
		expect(linksCount).toBeGreaterThan(0);
	});
});
