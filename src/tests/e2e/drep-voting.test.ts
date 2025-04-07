import { test, expect } from '@playwright/test';

test.describe('DRep Voting page', () => {
    test('should load and display voting data', async ({ page }) => {
        await page.goto('/drep-voting');

        // Check for main heading with specific text
        await expect(page.getByRole('heading', { name: /DRep Voting Dashboard/i, level: 1 })).toBeVisible();

        // Check that voting data is rendered by looking for specific terms
        await expect(page.locator('body')).toContainText(/total votes/i);
        await expect(page.locator('body')).toContainText(/yes votes/i);
        await expect(page.locator('body')).toContainText(/no votes/i);

        // Verify the page contains proposal information
        await expect(page.locator('body')).toContainText(/proposal/i);
    });
}); 