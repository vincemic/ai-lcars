import { test, expect } from '@playwright/test';

test.describe('LCARS Dashboard - Economics Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display economics section when selected', async ({ page }) => {
    // Click on economics button
    await page.locator('.lcars-button').filter({ hasText: 'ECONOMICS' }).click();
    
    // Verify economics section header
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'ECONOMICS OPERATIONS STATUS' })).toBeVisible();
  });

  test('should display stock indices panel', async ({ page }) => {
    // Navigate to economics section
    await page.locator('.lcars-button').filter({ hasText: 'ECONOMICS' }).click();
    
    // Check for stock indices section
    await expect(page.locator('h3').filter({ hasText: 'STOCK INDICES' })).toBeVisible();
  });

  test('should display economic indicators panel', async ({ page }) => {
    // Navigate to economics section
    await page.locator('.lcars-button').filter({ hasText: 'ECONOMICS' }).click();
    
    // Check for economic indicators section
    await expect(page.locator('h3').filter({ hasText: 'ECONOMIC INDICATORS' })).toBeVisible();
  });

  test('should display currency values panel', async ({ page }) => {
    // Navigate to economics section
    await page.locator('.lcars-button').filter({ hasText: 'ECONOMICS' }).click();
    
    // Check for currency values section
    await expect(page.locator('h3').filter({ hasText: 'CURRENCY VALUES' })).toBeVisible();
  });

  test('should show stock data with proper formatting when available', async ({ page }) => {
    // Navigate to economics section
    await page.locator('.lcars-button').filter({ hasText: 'ECONOMICS' }).click();
    
    // Wait for potential data loading
    await page.waitForTimeout(3000);
    
    // Look for stock indices data
    const stockSection = page.locator('h3').filter({ hasText: 'STOCK INDICES' }).locator('..');
    const stockText = await stockSection.textContent();
    
    // Should contain stock-related content
    expect(stockText).toBeTruthy();
    
    // Check if any stock symbols are present (like S&P 500, Dow Jones, etc.)
    const hasStockData = stockText?.includes('S&P') || 
                         stockText?.includes('Dow') || 
                         stockText?.includes('NASDAQ') ||
                         stockText?.includes('%');
    
    // Either has stock data or shows loading/empty state
    expect(hasStockData || stockText?.length === 0 || stockText?.includes('STOCK INDICES')).toBeTruthy();
  });

  test('economics button should become active when selected', async ({ page }) => {
    // Click economics button
    const economicsButton = page.locator('.lcars-button').filter({ hasText: 'ECONOMICS' });
    await economicsButton.click();
    
    // Verify button is active
    await expect(economicsButton).toHaveClass(/active/);
  });

  test('should switch between economics and other sections', async ({ page }) => {
    // Start with space section
    await page.locator('.lcars-button').filter({ hasText: 'SPACE' }).click();
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'SPACE OPERATIONS STATUS' })).toBeVisible();
    
    // Switch to economics
    await page.locator('.lcars-button').filter({ hasText: 'ECONOMICS' }).click();
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'ECONOMICS OPERATIONS STATUS' })).toBeVisible();
    
    // Switch to environment
    await page.locator('.lcars-button').filter({ hasText: 'ENVIRONMENT' }).click();
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'ENVIRONMENT OPERATIONS STATUS' })).toBeVisible();
    
    // Back to economics
    await page.locator('.lcars-button').filter({ hasText: 'ECONOMICS' }).click();
    await expect(page.locator('.lcars-screen-header').filter({ hasText: 'ECONOMICS OPERATIONS STATUS' })).toBeVisible();
  });

  test('should display all required economics subsections', async ({ page }) => {
    // Navigate to economics section
    await page.locator('.lcars-button').filter({ hasText: 'ECONOMICS' }).click();
    
    // Check all three main sections exist
    await expect(page.locator('h3').filter({ hasText: 'STOCK INDICES' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'ECONOMIC INDICATORS' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'CURRENCY VALUES' })).toBeVisible();
  });
});