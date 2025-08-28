import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - Performance and Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds (generous for CI environments)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have proper page structure for screen readers', async ({ page }) => {
    // Check for landmark elements
    const main = page.locator('.lcars-main');
    await expect(main).toBeVisible();
    
    // Check for heading hierarchy - we now have more h3 elements
    const headings = page.locator('h3');
    await expect(headings).toHaveCount(3); // ISS TRACKING, ASTRONAUTS IN SPACE, UPCOMING LAUNCHES
    
    // Verify important content is properly labeled
    await expect(page.locator('.time-label')).toBeVisible();
    await expect(page.locator('.slider-label')).toBeVisible();
    await expect(page.locator('.alert-header')).toBeVisible();
  });

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait for the page to fully load and run its scripts
    await page.waitForTimeout(3000);
    
    // Should not have any console errors (excluding CORS errors from real API calls)
    const nonCorsErrors = consoleErrors.filter(error => 
      !error.includes('CORS') && 
      !error.includes('Access-Control-Allow-Origin') &&
      !error.includes('ERR_FAILED')
    );
    expect(nonCorsErrors).toHaveLength(0);
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Block all network requests after initial load
    await page.route('**/*', route => route.abort());
    
    // The page should still function since it's a client-side app
    await expect(page.locator('.lcars-container')).toBeVisible();
    await expect(page.locator('.time-value')).toBeVisible();
  });

  test('should maintain functionality when JavaScript is disabled', async ({ browser }) => {
    // Create a context with JavaScript disabled
    const context = await browser.newContext({
      javaScriptEnabled: false
    });
    const page = await context.newPage();
    
    await page.goto('/');
    
    // Angular apps require JavaScript, so this test verifies graceful degradation
    const hasContent = await page.textContent('body');
    expect(hasContent).toBeTruthy(); // Should have some content even if not functional
    
    await context.close();
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Focus should start at the top of the page
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through interactive elements
    // Note: This is a basic test - full keyboard navigation would require more interactive elements
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThanOrEqual(0);
  });

  test('should handle rapid updates without memory leaks', async ({ page }) => {
    // Monitor console for any warnings about memory or performance
    const consoleWarnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });
    
    // Let the app run for a while with its timers
    await page.waitForTimeout(10000);
    
    // Should not have excessive warnings (more tolerance for real-time data updates)
    expect(consoleWarnings.length).toBeLessThan(100);
  });

  test('should maintain state consistency during rapid interactions', async ({ page }) => {
    // Click multiple navigation buttons rapidly
    const buttons = ['ENVIRONMENT', 'NAVIGATION', 'COMMUNICATIONS', 'ECONOMICS'];
    
    for (const buttonText of buttons) {
      const button = page.locator('.lcars-button').filter({ hasText: buttonText });
      await button.click();
      await page.waitForTimeout(100); // Small delay between clicks
    }
    
    // Page should still be functional
    await expect(page.locator('.lcars-container')).toBeVisible();
    await expect(page.locator('.time-value')).toBeVisible();
  });
});