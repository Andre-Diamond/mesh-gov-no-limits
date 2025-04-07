import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
    test('should load and display content', async ({ page }) => {
        await page.goto('/');

        // Check for heading
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        // Check for main content
        await expect(page.locator('main')).toBeVisible();

        // Check that we have data rendered
        await expect(page.locator('body')).toContainText(/data/i);
    });
}); 