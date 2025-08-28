import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - Navigation Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all navigation buttons', async ({ page }) => {
    const navigationButtons = [
      'SPACE',
      'ENVIRONMENT', 
      'NAVIGATION',
      'COMMUNICATIONS',
      'ECONOMICS',
      'ENGINEERING',
      'MEDICAL'
    ];

    for (const buttonText of navigationButtons) {
      await expect(page.locator('.lcars-button').filter({ hasText: buttonText })).toBeVisible();
    }
  });

  test('should have space button as active by default', async ({ page }) => {
    await expect(page.locator('.lcars-button.active').filter({ hasText: 'SPACE' })).toBeVisible();
  });

  test('navigation buttons should be clickable', async ({ page }) => {
    const environmentButton = page.locator('.lcars-button').filter({ hasText: 'ENVIRONMENT' });
    await expect(environmentButton).toBeVisible();
    
    // Click the environment button
    await environmentButton.click();
    
    // Verify the button becomes active
    await expect(environmentButton).toHaveClass(/active/);
  });

  test('should display stardate information', async ({ page }) => {
    await expect(page.locator('.lcars-text-display').filter({ hasText: 'STARDATE' })).toBeVisible();
    
    // Check that stardate value is displayed using a more specific selector
    const stardateValue = page.locator('.lcars-text-display').filter({ hasText: 'STARDATE' }).locator('.lcars-data');
    await expect(stardateValue).toBeVisible();
    
    // Verify stardate format (should be a number with decimal)
    const stardateText = await stardateValue.textContent();
    expect(stardateText).toMatch(/^\d+\.\d+$/);
  });

  test('stardate should update periodically', async ({ page }) => {
    const stardateElement = page.locator('.lcars-text-display').filter({ hasText: 'STARDATE' }).locator('.lcars-data');
    const initialStardate = await stardateElement.textContent();
    
    // Wait for stardate to update (it updates every 5 seconds)
    await page.waitForTimeout(6000);
    
    const updatedStardate = await stardateElement.textContent();
    expect(updatedStardate).not.toBe(initialStardate);
  });
});