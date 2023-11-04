import { expect, test, type Page } from '@playwright/test';

test.describe.parallel('Function', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto('/function');
		
		await page.waitForLoadState('networkidle');
	});

	test.afterAll(async () => {
		await page.close();
	});
	
	test('should call get-time function', async () => {
		await expect(page.getByTestId("function-call")).toContainText("The time is");
	});

	test('should call get-time function repeatedly', async () => {
		const content = await page.getByTestId("interval-function-call").textContent();
		page.waitForTimeout(3000);
		await expect(page.getByTestId("interval-function-call")).not.toContainText(content ?? "");
	});

	test('should call get-time function after delay', async () => {
		await expect(page.getByTestId("delayed-function-call")).toContainText("Loading...");
		page.waitForTimeout(3000);
		await expect(page.getByTestId("delayed-function-call")).toContainText("The time is");
	});

	test('should call get-time function at a scheduled time', async () => {
		await expect(page.getByTestId("scheduled-function-call")).toContainText("Loading...");
		page.waitForTimeout(5000);
		await expect(page.getByTestId("scheduled-function-call")).toContainText("The time is");
	});
});
