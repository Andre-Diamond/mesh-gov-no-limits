import { test, expect } from '@playwright/test';

test.describe('Mesh Stats page', () => {
    test('should load and display stats data with charts', async ({ page }) => {
        await page.goto('/mesh-stats');

        // Check for main heading with specific text
        await expect(page.getByRole('heading', { name: /Mesh SDK Statistics/i, level: 1 })).toBeVisible();

        // Check for time period stats that we know exist
        await expect(page.locator('body')).toContainText(/Last Week/i);
        await expect(page.locator('body')).toContainText(/Last Month/i);

        // The chart is now on the page
        await expect(page.locator('.recharts-wrapper').first()).toBeVisible();

        // Check for specific section headings
        await expect(page.getByText(/GitHub Usage/i)).toBeVisible();
    });
}); 