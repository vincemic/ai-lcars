import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - Visual and Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have LCARS styling elements', async ({ page }) => {
    // Check for LCARS elbows (rounded corners)
    await expect(page.locator('.lcars-elbow.top-left')).toBeVisible();
    await expect(page.locator('.lcars-elbow.top-right')).toBeVisible();
    await expect(page.locator('.lcars-elbow.bottom-left')).toBeVisible();
    await expect(page.locator('.lcars-elbow.bottom-right')).toBeVisible();
    
    // Check for LCARS bars
    await expect(page.locator('.lcars-bar.header-bar')).toBeVisible();
    await expect(page.locator('.lcars-bar.footer-bar')).toBeVisible();
  });

  test('should display footer information correctly', async ({ page }) => {
    const footerBar = page.locator('.lcars-bar.footer-bar');
    await expect(footerBar).toBeVisible();
    
    // Check footer content
    await expect(footerBar).toContainText('COMPUTER ACCESS');
    await expect(footerBar).toContainText('LEVEL 10');
    await expect(footerBar).toContainText('AUTHORIZATION REQUIRED');
  });

  test('should have proper LCARS color scheme applied', async ({ page }) => {
    // Check that main elements have LCARS styling
    const activeButton = page.locator('.lcars-button.active');
    await expect(activeButton).toBeVisible();
    
    // Verify status indicators are visible (indicating proper CSS)
    const statusIndicators = page.locator('.status-indicator.active');
    await expect(statusIndicators.first()).toBeVisible();
  });

  test('should be accessible with proper semantic elements', async ({ page }) => {
    // Check for headings
    await expect(page.locator('h3').filter({ hasText: 'SENSOR READINGS' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'CREW STATUS' })).toBeVisible();
    
    // Check that important information is properly structured
    const dataLines = page.locator('.data-line');
    await expect(dataLines).toHaveCount(6); // 3 sensor + 3 crew status items
  });

  test('should handle screen size changes gracefully', async ({ page }) => {
    // Test various screen sizes
    const sizes = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1366, height: 768 },  // Laptop
      { width: 768, height: 1024 },  // Tablet
      { width: 414, height: 896 },   // Mobile
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      
      // Main container should always be visible
      await expect(page.locator('.lcars-container')).toBeVisible();
      
      // Key elements should remain accessible
      await expect(page.locator('.lcars-header')).toBeVisible();
      await expect(page.locator('.lcars-main')).toBeVisible();
      await expect(page.locator('.lcars-footer')).toBeVisible();
    }
  });

  test('should maintain visual consistency across different elements', async ({ page }) => {
    // All LCARS buttons should be visible
    const lcarsButtons = page.locator('.lcars-button');
    const buttonCount = await lcarsButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    for (let i = 0; i < buttonCount; i++) {
      await expect(lcarsButtons.nth(i)).toBeVisible();
    }
    
    // All status indicators should be visible
    const statusIndicators = page.locator('.status-indicator');
    const indicatorCount = await statusIndicators.count();
    expect(indicatorCount).toBe(4); // Should have 4 status indicators
    
    for (let i = 0; i < indicatorCount; i++) {
      await expect(statusIndicators.nth(i)).toBeVisible();
    }
  });
});