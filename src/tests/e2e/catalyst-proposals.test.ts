import { test, expect } from '@playwright/test';

test.describe('Catalyst Proposals page', () => {
    test('should load and display proposals data', async ({ page }) => {
        await page.goto('/catalyst-proposals');

        // Check for specific heading
        await expect(page.getByRole('heading', { name: /Catalyst Proposals/i, level: 1 })).toBeVisible();

        // Look for table element instead of custom data-testid
        const proposalsList = page.locator('table').first();
        await expect(proposalsList).toBeVisible();

        // Check that proposal data is rendered
        await expect(page.locator('body')).toContainText(/proposal|budget|progress/i);

        // Just verify that the page has content related to projects
        await expect(page.locator('body')).toContainText(/projects|mesh/i);
    });
}); 