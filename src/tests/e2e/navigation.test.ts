import { test, expect } from '@playwright/test';

test.describe('Navigation tests', () => {
    test('should navigate to all pages', async ({ page }) => {
        // Visit homepage
        await page.goto('/');
        // Check page content instead of title
        await expect(page.getByText(/Mesh Governance|Mesh Gov/i)).toBeVisible();

        // Navigate to each page manually and verify content
        await page.goto('/catalyst-proposals');
        await expect(page.getByRole('heading', { name: /Catalyst Proposals/i })).toBeVisible();

        await page.goto('/drep-voting');
        await expect(page.getByRole('heading', { name: /DRep Voting/i })).toBeVisible();

        await page.goto('/mesh-stats');
        await expect(page.getByRole('heading', { name: /Mesh SDK Statistics/i })).toBeVisible();
    });
}); 