import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - ISS Tracking Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display ISS tracking section on space tab', async ({ page }) => {
    // Ensure we're on the space tab
    await page.locator('.lcars-button').filter({ hasText: 'SPACE' }).click();
    
    // Check that ISS tracking section is visible
    await expect(page.locator('h3').filter({ hasText: 'ISS TRACKING' })).toBeVisible();
  });

  test('should show ISS tracking alert when data is available', async ({ page }) => {
    // Wait for data to potentially load
    await page.waitForTimeout(3000);
    
    // Check for ISS tracking related alerts
    const alertsPanel = page.locator('.alerts-panel, .lcars-alert-panel').first();
    const alertText = await alertsPanel.textContent();
    
    // Should contain some ISS-related alert
    expect(alertText).toMatch(/(ISS|TRACKING|DATA STREAMS)/i);
  });

  test('should display either ISS coordinates or acquiring signal message', async ({ page }) => {
    // Wait for potential data loading
    await page.waitForTimeout(5000);
    
    // Check for ISS position in navigation or acquiring signal in main content
    const issPositionInNav = page.locator('.lcars-text-display').filter({ hasText: 'ISS POSITION' });
    const acquiringSignal = page.locator('text=Acquiring signal...');
    const coordinatesData = page.locator('text=Coordinates:');
    
    const hasNavPosition = await issPositionInNav.count() > 0;
    const isAcquiring = await acquiringSignal.count() > 0;
    const hasCoordinates = await coordinatesData.count() > 0;
    
    // At least one of these should be true
    expect(hasNavPosition || isAcquiring || hasCoordinates).toBeTruthy();
  });

  test('should display astronauts section', async ({ page }) => {
    await expect(page.locator('h3').filter({ hasText: 'ASTRONAUTS IN SPACE' })).toBeVisible();
    
    // Wait a moment for data to potentially load
    await page.waitForTimeout(3000);
    
    // Check if astronaut data is displayed
    const astronautSection = page.locator('h3').filter({ hasText: 'ASTRONAUTS IN SPACE' }).locator('..');
    const sectionText = await astronautSection.textContent();
    
    // Should contain some astronaut information or be empty (which is also valid)
    expect(sectionText).toBeTruthy();
  });

  test('should display upcoming launches section', async ({ page }) => {
    await expect(page.locator('h3').filter({ hasText: 'UPCOMING LAUNCHES' })).toBeVisible();
  });

  test('coordinate format should be valid when displayed', async ({ page }) => {
    // Wait for data loading
    await page.waitForTimeout(5000);
    
    const issPositionDisplay = page.locator('.lcars-text-display').filter({ hasText: 'ISS POSITION' });
    
    if (await issPositionDisplay.count() > 0) {
      const coordinates = issPositionDisplay.locator('.lcars-data');
      const coordCount = await coordinates.count();
      
      if (coordCount >= 2) {
        const lat = await coordinates.first().textContent();
        const lng = await coordinates.last().textContent();
        
        // Check coordinate format (should have degree symbol and N/S/E/W)
        expect(lat).toMatch(/\d+\.\d+°\s*[NS]/);
        expect(lng).toMatch(/\d+\.\d+°\s*[EW]/);
      }
    }
  });

  test('ISS tracking should be responsive to navigation changes', async ({ page }) => {
    // Start on space tab and verify ISS tracking is visible
    await page.locator('.lcars-button').filter({ hasText: 'SPACE' }).click();
    await expect(page.locator('h3').filter({ hasText: 'ISS TRACKING' })).toBeVisible();
    
    // Switch to another tab
    await page.locator('.lcars-button').filter({ hasText: 'ENVIRONMENT' }).click();
    await expect(page.locator('h3').filter({ hasText: 'ISS TRACKING' })).not.toBeVisible();
    
    // Switch back to space
    await page.locator('.lcars-button').filter({ hasText: 'SPACE' }).click();
    await expect(page.locator('h3').filter({ hasText: 'ISS TRACKING' })).toBeVisible();
  });
});