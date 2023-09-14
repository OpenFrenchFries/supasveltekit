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

	test('should display bucket file names', async () => {
		const bucketNames = await page.$$eval('[data-testid="bucket-name"]', (elements) =>
		  elements.map((el) => el.textContent)
		);
		expect(bucketNames).toEqual(['hello.txt']);
	});
	
});
