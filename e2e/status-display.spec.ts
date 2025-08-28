import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - Status Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display space operations status', async ({ page }) => {
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'SPACE OPERATIONS STATUS' })).toBeVisible();
  });

  test('should display real-time data sections', async ({ page }) => {
    // Check for ISS tracking section
    await expect(page.locator('h3').filter({ hasText: 'ISS TRACKING' })).toBeVisible();
    
    // Check for astronauts section  
    await expect(page.locator('h3').filter({ hasText: 'ASTRONAUTS IN SPACE' })).toBeVisible();
    
    // Check for upcoming launches section
    await expect(page.locator('h3').filter({ hasText: 'UPCOMING LAUNCHES' })).toBeVisible();
  });

  test('should display navigation sections', async ({ page }) => {
    // Test switching to different sections
    await page.locator('.lcars-button').filter({ hasText: 'ENVIRONMENT' }).click();
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'ENVIRONMENT OPERATIONS STATUS' })).toBeVisible();
    
    await page.locator('.lcars-button').filter({ hasText: 'COMMUNICATIONS' }).click();
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'COMMUNICATIONS OPERATIONS STATUS' })).toBeVisible();
    
    // Switch back to space
    await page.locator('.lcars-button').filter({ hasText: 'SPACE' }).click();
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'SPACE OPERATIONS STATUS' })).toBeVisible();
  });

  test('should display ISS position data', async ({ page }) => {
    // Check for ISS position display in left panel
    await expect(page.locator('.lcars-text-display').filter({ hasText: 'ISS POSITION' })).toBeVisible();
    
    // Check that coordinates are displayed (should have both latitude and longitude)
    const coordinates = page.locator('.lcars-text-display').filter({ hasText: 'ISS POSITION' }).locator('.lcars-data');
    const coordinateCount = await coordinates.count();
    expect(coordinateCount).toBe(2); // Latitude and longitude
    
    // Check that both coordinates are visible
    await expect(coordinates.first()).toBeVisible();
    await expect(coordinates.last()).toBeVisible();
  });

  test('stardate should update periodically', async ({ page }) => {
    // Get initial stardate from the specific stardate display
    const stardateElement = page.locator('.lcars-text-display').filter({ hasText: 'STARDATE' }).locator('.lcars-data');
    const initialStardate = await stardateElement.textContent();
    
    // Wait for stardate to update (updates every 5 seconds)
    await page.waitForTimeout(6000);
    
    const updatedStardate = await stardateElement.textContent();
    expect(updatedStardate).not.toBe(initialStardate);
    expect(updatedStardate).toMatch(/^\d+\.\d+$/);
  });

  test('real-time data should be present', async ({ page }) => {
    // Wait a moment for data to load
    await page.waitForTimeout(2000);
    
    // Check that ISS data is being displayed
    const issSection = page.locator('h3').filter({ hasText: 'ISS TRACKING' });
    await expect(issSection).toBeVisible();
    
    // Check that the data grid contains panels
    const dataPanels = page.locator('.data-panel');
    await expect(dataPanels.first()).toBeVisible();
  });
});