import { expect, test, type Page } from '@playwright/test';

test.describe.parallel('Storage', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto('/storage');
	});

	test.beforeEach(async () => {
		await page.reload();
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('should display buckets names', async () => {
		await expect(page.getByRole('heading', { name: 'test-bucket' })).toBeDefined();
	});

	test('should display bucket file names', async () => {
		await expect(page.getByTestId('hello.txt')).toBeDefined();
	});
	
	test('should display download link', async () => {
		await expect(page.getByRole('link', { name: 'hello.txt' })).toBeDefined();
	});

	test('should create and upload a file and should display error on duplication', async () => {
		await expect(page.getByRole('button', { name: 'Create file' })).toBeVisible();
		await page.getByRole('button', { name: 'Create file' }).click();
		await expect(page.getByTestId("upload-filename")).toBeVisible();
		await expect(page.getByTestId("upload-filename")).toContainText("goodbye.txt");
	});
	
	test('should display error on duplication', async () => {
		await page.getByRole('button', { name: 'Duplicate hello.txt' }).click();
		await expect(page.getByTestId("upload-error")).toBeVisible();
		await expect(page.getByTestId("upload-error")).toContainText("The resource already exists");
	});
	
});
