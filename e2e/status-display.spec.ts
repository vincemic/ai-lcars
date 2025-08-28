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

  test('should display ISS tracking details when data is available', async ({ page }) => {
    // Wait longer for mock data to load
    await page.waitForTimeout(5000);
    
    // Check for ISS tracking section
    const issSection = page.locator('h3').filter({ hasText: 'ISS TRACKING' });
    await expect(issSection).toBeVisible();
    
    // Look for either actual data or fallback message
    const altitudeInfo = page.locator('text=Altitude:');
    const coordinatesInfo = page.locator('text=Coordinates:');
    const acquiringSignal = page.locator('text=Acquiring signal...');
    
    const hasData = await altitudeInfo.count() > 0 && await coordinatesInfo.count() > 0;
    const isAcquiring = await acquiringSignal.count() > 0;
    
    // Either real data should be shown OR acquiring signal
    expect(hasData || isAcquiring).toBeTruthy();
    
    // If data is available, verify format
    if (hasData) {
      // Check altitude format (should show "XXX km")
      const altitudeText = await page.locator('text=Altitude:').locator('..').textContent();
      expect(altitudeText).toMatch(/\d+\s*km/);
      
      // Check coordinates format (should show degrees)
      const coordText = await page.locator('text=Coordinates:').locator('..').textContent();
      expect(coordText).toMatch(/\d+\.\d+°.*\d+\.\d+°/);
    }
  });

  test('should display ISS position data when available', async ({ page }) => {
    // Wait for potential data to load
    await page.waitForTimeout(3000);
    
    // Check for ISS tracking section in the main content
    await expect(page.locator('h3').filter({ hasText: 'ISS TRACKING' })).toBeVisible();
    
    // Check if ISS position is displayed in left panel OR if it shows acquiring signal
    const issPositionText = page.locator('.lcars-text-display').filter({ hasText: 'ISS POSITION' });
    const acquiringSignal = page.locator('text=Acquiring signal...');
    
    // Either ISS position data should be visible OR acquiring signal should be shown
    const hasIssPosition = await issPositionText.count() > 0;
    const isAcquiring = await acquiringSignal.count() > 0;
    
    expect(hasIssPosition || isAcquiring).toBeTruthy();
    
    // If ISS position is available, check coordinates format
    if (hasIssPosition) {
      const coordinates = issPositionText.locator('.lcars-data');
      const coordinateCount = await coordinates.count();
      expect(coordinateCount).toBe(2); // Latitude and longitude
      
      // Check that both coordinates are visible and contain degree symbols
      const lat = await coordinates.first().textContent();
      const lng = await coordinates.last().textContent();
      expect(lat).toMatch(/°/);
      expect(lng).toMatch(/°/);
    }
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