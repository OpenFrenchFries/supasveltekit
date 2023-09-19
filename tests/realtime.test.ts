import { expect, test, type Page } from '@playwright/test';

test.describe.parallel('Realtime', () => {
	let page1: Page;
	let page2: Page;

	test.beforeAll(async ({ browser }) => {
		page1 = await browser.newPage();
		await page1.goto('/realtime');
		page2 = await browser.newPage();
		await page2.goto('/realtime');
		
		await page1.waitForTimeout(1000);
	});

	test.afterAll(async () => {
		await page1.close();
		await page2.close();
	});
	
	test('should receive broadcast message', async () => {
		await page1.getByRole('button', { name: 'Send message' }).click();
		await expect(page2.getByTestId("received-message")).toBeVisible();
		await expect(page2.getByTestId("received-message")).toContainText("Last message received: Hello from any/message!");
	});

	test('should sync realtime presences', async () => {
		await expect(page1.getByTestId("users-online")).toContainText("0");
		await expect(page2.getByTestId("users-online")).toContainText("0");

		await page1.getByTestId("username").fill("User 1");
		await page1.getByRole('button', { name: 'Set status to online' }).click();

		await expect(page1.getByTestId("users-online")).toContainText("1");
		await expect(page2.getByTestId("users-online")).toContainText("1");

		await expect(page1.getByTestId("User 1")).toContainText("User 1");
		await expect(page2.getByTestId("User 1")).toContainText("User 1");

		await page2.getByTestId("username").fill("User 2");
		await page2.getByRole('button', { name: 'Set status to online' }).click();

		await expect(page1.getByTestId("users-online")).toContainText("2");
		await expect(page2.getByTestId("users-online")).toContainText("2");

		await expect(page1.getByTestId("User 2")).toContainText("User 2");
		await expect(page2.getByTestId("User 2")).toContainText("User 2");
		
	});
	
});
