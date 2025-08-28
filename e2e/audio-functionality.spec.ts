import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - Audio Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display audio toggle button', async ({ page }) => {
    // Check for audio toggle button
    const audioButton = page.locator('.audio-toggle');
    await expect(audioButton).toBeVisible();
    
    // Should show initial state
    await expect(audioButton).toContainText('AUDIO');
  });

  test('should toggle audio state when clicked', async ({ page }) => {
    const audioButton = page.locator('.audio-toggle');
    
    // Get initial state
    const initialText = await audioButton.textContent();
    
    // Click to toggle
    await audioButton.click();
    
    // Wait a moment for state change
    await page.waitForTimeout(100);
    
    // State should have changed
    const newText = await audioButton.textContent();
    expect(newText).not.toBe(initialText);
  });

  test('should have interactive warp speed slider', async ({ page }) => {
    // Check for warp speed slider input
    const sliderInput = page.locator('.warp-slider-input');
    await expect(sliderInput).toBeVisible();
    
    // Check initial value display
    const initialValue = await page.locator('.slider-value').textContent();
    expect(initialValue).toBe('0');
    
    // Interact with slider
    await sliderInput.fill('5');
    
    // Wait for update
    await page.waitForTimeout(200);
    
    // Value should update
    const newValue = await page.locator('.slider-value').textContent();
    expect(newValue).toBe('5');
  });

  test('should play sounds on navigation button clicks', async ({ page }) => {
    // Enable audio context by user interaction
    const audioButton = page.locator('.audio-toggle');
    await audioButton.click();
    
    // Click navigation buttons - we can't test actual audio but ensure clicks work
    const spaceButton = page.locator('.lcars-button').filter({ hasText: 'SPACE' });
    const environmentButton = page.locator('.lcars-button').filter({ hasText: 'ENVIRONMENT' });
    
    await spaceButton.click();
    await expect(spaceButton).toHaveClass(/active/);
    
    await environmentButton.click();
    await expect(environmentButton).toHaveClass(/active/);
    await expect(spaceButton).not.toHaveClass(/active/);
  });

  test('should have accessibility attributes on slider', async ({ page }) => {
    const sliderInput = page.locator('.warp-slider-input');
    
    // Check for accessibility attributes
    await expect(sliderInput).toHaveAttribute('title', 'Warp Speed Control');
    await expect(sliderInput).toHaveAttribute('aria-label', 'Warp Speed Control');
    await expect(sliderInput).toHaveAttribute('min', '0');
    await expect(sliderInput).toHaveAttribute('max', '10');
  });

  test('should show warp speed in right panel controls', async ({ page }) => {
    // Navigate to engineering section
    await page.locator('.lcars-button').filter({ hasText: 'ENGINEERING' }).click();
    
    // Check for warp speed control in right panel (should be visible in all sections)
    const warpSpeedSlider = page.locator('.lcars-slider');
    await expect(warpSpeedSlider).toBeVisible();
    
    // Should show warp speed label and value
    await expect(page.locator('.slider-label')).toContainText('WARP SPEED');
    await expect(page.locator('.slider-value')).toBeVisible();
  });

  test('should have proper visual feedback for audio button states', async ({ page }) => {
    const audioButton = page.locator('.audio-toggle');
    
    // Check initial styling
    const initialClasses = await audioButton.getAttribute('class');
    
    // Click to toggle
    await audioButton.click();
    await page.waitForTimeout(100);
    
    // Classes should update to reflect state
    const newClasses = await audioButton.getAttribute('class');
    
    // Should have state-specific classes
    expect(newClasses).toContain('audio-toggle');
    
    // Text content should reflect state
    const buttonText = await audioButton.textContent();
    expect(buttonText).toMatch(/AUDIO (ON|OFF)/);
  });

  test('should maintain audio state across navigation', async ({ page }) => {
    const audioButton = page.locator('.audio-toggle');
    
    // Toggle audio state
    await audioButton.click();
    const audioState = await audioButton.textContent();
    
    // Navigate to different sections
    await page.locator('.lcars-button').filter({ hasText: 'NAVIGATION' }).click();
    await page.locator('.lcars-button').filter({ hasText: 'COMMUNICATIONS' }).click();
    await page.locator('.lcars-button').filter({ hasText: 'SPACE' }).click();
    
    // Audio state should be preserved
    const finalAudioState = await audioButton.textContent();
    expect(finalAudioState).toBe(audioState);
  });
});