import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main LCARS interface', async ({ page }) => {
    // Check if the main LCARS container is present
    await expect(page.locator('.lcars-container')).toBeVisible();
    
    // Verify the USS Enterprise header
    await expect(page.locator('.lcars-header .lcars-text')).toContainText('USS ENTERPRISE NCC-1701-D');
    
    // Check if the main sections are present
    await expect(page.locator('.lcars-left-panel')).toBeVisible();
    await expect(page.locator('.lcars-center')).toBeVisible();
    await expect(page.locator('.lcars-right-panel')).toBeVisible();
  });

  test('should display correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/USS Enterprise LCARS Dashboard/);
  });

  test('should have responsive layout', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('.lcars-container')).toBeVisible();
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.lcars-container')).toBeVisible();
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.lcars-container')).toBeVisible();
  });
});