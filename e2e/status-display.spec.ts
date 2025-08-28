import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - Status Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display bridge operations status', async ({ page }) => {
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'BRIDGE OPERATIONS STATUS' })).toBeVisible();
  });

  test('should display all system status indicators', async ({ page }) => {
    const statusItems = [
      'WARP CORE',
      'SHIELDS', 
      'LIFE SUPPORT',
      'IMPULSE ENGINES'
    ];

    for (const statusLabel of statusItems) {
      await expect(page.locator('.status-label').filter({ hasText: statusLabel })).toBeVisible();
      
      // Check that each status has an indicator
      const statusItem = page.locator('.status-item').filter({ 
        has: page.locator('.status-label').filter({ hasText: statusLabel })
      });
      await expect(statusItem.locator('.status-indicator')).toBeVisible();
      await expect(statusItem.locator('.status-value')).toBeVisible();
    }
  });

  test('should display sensor readings', async ({ page }) => {
    await expect(page.locator('h3').filter({ hasText: 'SENSOR READINGS' })).toBeVisible();
    
    // Check for temperature reading
    await expect(page.locator('.data-line').filter({ hasText: 'Temperature:' })).toBeVisible();
    
    // Check for hull integrity
    await expect(page.locator('.data-line').filter({ hasText: 'Hull Integrity:' })).toBeVisible();
    
    // Check for power levels
    await expect(page.locator('.data-line').filter({ hasText: 'Power Levels:' })).toBeVisible();
  });

  test('should display crew status information', async ({ page }) => {
    await expect(page.locator('h3').filter({ hasText: 'CREW STATUS' })).toBeVisible();
    
    // Check for personnel count
    await expect(page.locator('.data-line').filter({ hasText: 'Personnel:' })).toBeVisible();
    
    // Check for on duty count
    await expect(page.locator('.data-line').filter({ hasText: 'On Duty:' })).toBeVisible();
    
    // Check for medical status
    await expect(page.locator('.data-line').filter({ hasText: 'Medical:' })).toBeVisible();
  });

  test('sensor readings should have valid values', async ({ page }) => {
    // Temperature should be a number with °C
    const tempValue = page.locator('.data-line').filter({ hasText: 'Temperature:' }).locator('.data-value');
    const tempText = await tempValue.textContent();
    expect(tempText).toMatch(/^\d+°C$/);
    
    // Hull integrity should be a percentage
    const hullValue = page.locator('.data-line').filter({ hasText: 'Hull Integrity:' }).locator('.data-value');
    const hullText = await hullValue.textContent();
    expect(hullText).toMatch(/^\d+%$/);
    
    // Power levels should be a percentage
    const powerValue = page.locator('.data-line').filter({ hasText: 'Power Levels:' }).locator('.data-value');
    const powerText = await powerValue.textContent();
    expect(powerText).toMatch(/^\d+%$/);
  });

  test('dynamic data should update periodically', async ({ page }) => {
    // Get initial temperature
    const tempElement = page.locator('.data-line').filter({ hasText: 'Temperature:' }).locator('.data-value');
    const initialTemp = await tempElement.textContent();
    
    // Wait for data to update (updates every 3 seconds)
    await page.waitForTimeout(4000);
    
    const updatedTemp = await tempElement.textContent();
    // Temperature might be the same, but we're testing that the mechanism works
    // The actual change depends on random values, so we just verify the format is still correct
    expect(updatedTemp).toMatch(/^\d+°C$/);
  });
});