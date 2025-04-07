# E2E Tests

This directory contains end-to-end tests using Playwright.

## Running Tests

To run the E2E tests, use one of the following commands:

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# Run tests in headless mode
npm run test:e2e:headless

# Run a specific test file
npx playwright test home.test.ts
```

## Test Structure

- `navigation.test.ts`: Tests navigation between pages
- `home.test.ts`: Tests the home page content
- `catalyst-proposals.test.ts`: Tests the catalyst proposals page and data rendering
- `drep-voting.test.ts`: Tests the DRep voting page and data rendering
- `mesh-stats.test.ts`: Tests the mesh stats page and charts
- `data-mocking.test.ts`: Tests data rendering by checking for expected content

## Testing Best Practices

When writing tests, follow these best practices:

1. Use specific selectors:
   ```ts
   // Specific heading with text and level
   page.getByRole('heading', { name: /Mesh SDK Statistics/i, level: 1 })
   ```

2. Test for content rather than structure when possible:
   ```ts
   await expect(page.locator('body')).toContainText(/expected text/i);
   ```

3. Add data-testid attributes to important elements:
   ```tsx
   <div data-testid="proposals-list">...</div>
   ```

4. When checking for elements with count, use:
   ```ts
   const elements = await page.locator('selector').count();
   expect(elements).toBeGreaterThan(0);
   ```

## CI Integration

Tests are automatically run in GitHub Actions workflow on push to main branch and on pull requests.
Results and artifacts are available in the GitHub Actions tab. 