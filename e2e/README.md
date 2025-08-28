# E2E Tests for LCARS Dashboard

This directory contains end-to-end tests for the Star Trek LCARS Dashboard using Playwright.

## Test Structure

### Test Files

- **`basic-functionality.spec.ts`** - Tests basic page loading and responsive layout
- **`navigation-panel.spec.ts`** - Tests the left navigation panel and stardate functionality
- **`status-display.spec.ts`** - Tests the central status display and sensor readings
- **`right-panel-controls.spec.ts`** - Tests warp speed slider, alerts, and time display
- **`visual-styling.spec.ts`** - Tests LCARS visual elements and styling consistency
- **`performance-accessibility.spec.ts`** - Tests performance, accessibility, and error handling
- **`page-object-tests.spec.ts`** - Tests using Page Object Model pattern

### Page Objects

- **`page-objects/lcars-page.ts`** - Page Object Model for the LCARS dashboard

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Available Commands

- **Run all tests headless:**
  ```bash
  npm run test:e2e
  ```

- **Run tests with UI mode:**
  ```bash
  npm run test:e2e:ui
  ```

- **Run tests in headed mode (see browser):**
  ```bash
  npm run test:e2e:headed
  ```

- **Debug tests:**
  ```bash
  npm run test:e2e:debug
  ```

- **View test report:**
  ```bash
  npm run test:e2e:report
  ```

### Running Specific Tests

- **Run a specific test file:**
  ```bash
  npx playwright test basic-functionality.spec.ts
  ```

- **Run tests matching a pattern:**
  ```bash
  npx playwright test --grep "navigation"
  ```

- **Run tests in a specific project (browser):**
  ```bash
  npx playwright test --project=chromium
  ```

## Test Configuration

The tests are configured in `playwright.config.ts` with the following setup:

- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL:** http://localhost:4200
- **Auto-start:** Development server starts automatically
- **Retries:** 2 retries on CI, 0 locally
- **Reporters:** HTML report with traces and screenshots on failure

## Test Coverage

### Functional Tests
- ✅ Page loading and basic structure
- ✅ Navigation panel functionality
- ✅ Status indicators and data display
- ✅ Real-time updates (stardate, time, sensor data)
- ✅ Alert system
- ✅ Warp speed display

### Visual Tests
- ✅ LCARS styling and color scheme
- ✅ Responsive design across device sizes
- ✅ Element positioning and layout
- ✅ Visual consistency

### Performance Tests
- ✅ Page load time
- ✅ JavaScript error monitoring
- ✅ Memory leak detection
- ✅ Network failure handling

### Accessibility Tests
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy

## Test Data

The tests verify the following default data:

- **Initial Stardate:** ~47457.1 (updates every 5 seconds)
- **Crew Count:** 1014 personnel
- **On Duty:** 147 crew members
- **Medical Status:** NOMINAL
- **Default Alerts:** "SYSTEM NOMINAL" (low priority), "ROUTINE MAINTENANCE DUE" (medium priority)
- **Initial Warp Speed:** 0

## Continuous Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main`

Results are available in GitHub Actions with:
- HTML test reports
- Screenshots on failure
- Video recordings of failed tests
- Trace files for debugging

## Debugging Tests

### Using Playwright Inspector

```bash
npm run test:e2e:debug
```

This opens the Playwright Inspector where you can:
- Step through tests
- Inspect page elements
- View console logs
- Record new tests

### Using VS Code Extension

Install the Playwright VS Code extension for:
- Running tests from the editor
- Debugging with breakpoints
- Viewing test results inline

### Viewing Traces

After test failures, view traces with:
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

## Writing New Tests

### Best Practices

1. **Use Page Object Model** for complex interactions
2. **Wait for elements** to be visible before interacting
3. **Use semantic selectors** (prefer text content over CSS classes)
4. **Test user workflows** not just individual elements
5. **Keep tests isolated** and independent

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something specific', async ({ page }) => {
    // Arrange
    const element = page.locator('[data-testid="element"]');
    
    // Act
    await element.click();
    
    // Assert
    await expect(element).toHaveText('Expected Text');
  });
});
```

## Contributing

When adding new features to the LCARS dashboard:

1. Add corresponding E2E tests
2. Update page objects if needed
3. Ensure tests pass on all browsers
4. Update this README if test structure changes

## Live Long and Prosper! 🖖

These tests ensure the USS Enterprise LCARS system maintains optimal functionality across all operational parameters.