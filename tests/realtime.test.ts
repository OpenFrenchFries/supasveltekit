import { expect, test, type Page } from '@playwright/test';

test.describe.serial('Storage', () => {
	let page1: Page;
	let page2: Page;

	test.beforeAll(async ({ browser }) => {
		page1 = await browser.newPage();
		await page1.goto('/realtime');
		page2 = await browser.newPage();
		await page2.goto('/realtime');
	});

	test.afterAll(async () => {
		await page1.close();
		await page2.close();
	});
	
	test('should receive broadcast messae', async () => {
		await page1.getByRole('button', { name: 'Send message' }).click();
		await expect(page2.getByTestId("received-message")).toBeVisible();
		await expect(page2.getByTestId("received-message")).toContainText("Last message received: Hello from any/message!");
	});
	
});
