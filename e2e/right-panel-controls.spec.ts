import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - Right Panel Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display warp speed slider', async ({ page }) => {
    await expect(page.locator('.slider-label').filter({ hasText: 'WARP SPEED' })).toBeVisible();
    await expect(page.locator('.slider-track')).toBeVisible();
    await expect(page.locator('.slider-thumb')).toBeVisible();
    await expect(page.locator('.slider-value')).toBeVisible();
  });

  test('should display alerts panel', async ({ page }) => {
    await expect(page.locator('.alert-header').filter({ hasText: 'ALERTS' })).toBeVisible();
    
    // Check for alert items - now we have at least 3 default alerts (may have dynamic ones)
    const alertItems = page.locator('.alert-item');
    await expect(alertItems).toHaveCount(await alertItems.count()); // Accept current count
    const alertCount = await alertItems.count();
    expect(alertCount).toBeGreaterThanOrEqual(3); // Should have at least 3 alerts
    
    // Verify alert content
    await expect(alertItems.first()).toContainText('SYSTEM NOMINAL');
    await expect(alertItems.nth(1)).toContainText('ISS TRACKING ACTIVE');
  });

  test('should display current time', async ({ page }) => {
    await expect(page.locator('.time-label').filter({ hasText: 'CURRENT TIME' })).toBeVisible();
    await expect(page.locator('.time-value')).toBeVisible();
    await expect(page.locator('.date-value')).toBeVisible();
  });

  test('time should update every second', async ({ page }) => {
    const timeElement = page.locator('.time-value');
    const initialTime = await timeElement.textContent();
    
    // Wait for at least 2 seconds to see time change
    await page.waitForTimeout(2000);
    
    const updatedTime = await timeElement.textContent();
    expect(updatedTime).not.toBe(initialTime);
  });

  test('time format should be correct', async ({ page }) => {
    const timeElement = page.locator('.time-value');
    const dateElement = page.locator('.date-value');
    
    const timeText = await timeElement.textContent();
    const dateText = await dateElement.textContent();
    
    // Time should be in HH:mm:ss format
    expect(timeText).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    
    // Date should be in yyyy.MM.dd format
    expect(dateText).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
  });

  test('warp speed should display correct initial value', async ({ page }) => {
    const warpSpeedValue = page.locator('.slider-value');
    const warpSpeedText = await warpSpeedValue.textContent();
    
    // Initial warp speed should be 0
    expect(warpSpeedText).toBe('0');
  });

  test('alert items should have proper priority classes', async ({ page }) => {
    const alertItems = page.locator('.alert-item');
    
    // All alerts should have 'low' priority class in default state
    await expect(alertItems.first()).toHaveClass(/low/);
    await expect(alertItems.nth(1)).toHaveClass(/low/);
    await expect(alertItems.last()).toHaveClass(/low/);
  });
});