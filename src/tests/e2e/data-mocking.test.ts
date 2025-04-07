import { test, expect } from '@playwright/test';

test.describe('Data fetching and rendering tests', () => {
    test('should check for existing data on the proposals page', async ({ page }) => {
        // Go to proposals page and verify some expected content
        await page.goto('/catalyst-proposals');
        await expect(page.getByRole('heading', { name: /Catalyst Proposals/i })).toBeVisible();

        // Check for some specific data that we know exists
        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('body')).toContainText(/mesh/i);
    });

    test('should check for existing data on the voting page', async ({ page }) => {
        // Go to voting page and verify some expected content
        await page.goto('/drep-voting');
        await expect(page.getByRole('heading', { name: /DRep Voting/i })).toBeVisible();

        // Check for some specific data that we know exists
        await expect(page.locator('body')).toContainText(/yes|no|abstain/i);
        await expect(page.locator('body')).toContainText(/proposal/i);
    });

    test('should check for existing charts on the stats page', async ({ page }) => {
        // Go to stats page and verify chart components
        await page.goto('/mesh-stats');

        // Verify chart is present
        const chart = page.locator('.recharts-wrapper').first();
        await expect(chart).toBeVisible();

        // Verify some data points or titles are visible
        await expect(page.locator('body')).toContainText(/stats|monthly|yearly/i);
    });
}); 