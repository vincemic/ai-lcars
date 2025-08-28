import { test, expect } from '@playwright/test';
import { LCARSPage } from './page-objects/lcars-page';

test.describe('LCARS Dashboard - Page Object Model Tests', () => {
  let lcarsPage: LCARSPage;

  test.beforeEach(async ({ page }) => {
    lcarsPage = new LCARSPage(page);
    await lcarsPage.goto();
  });

  test('should display all navigation elements using page object', async () => {
    // Test header
    await expect(lcarsPage.headerTitle).toContainText('USS ENTERPRISE NCC-1701-D');
    await expect(lcarsPage.topLeftElbow).toBeVisible();
    await expect(lcarsPage.topRightElbow).toBeVisible();

    // Test navigation buttons
    const navigationTexts = await lcarsPage.getNavigationButtonTexts();
    const expectedButtons = ['NAVIGATION', 'SENSORS', 'TACTICAL', 'ENGINEERING', 'MEDICAL', 'SCIENCE', 'COMMUNICATIONS'];
    expect(navigationTexts).toEqual(expectedButtons);

    // Test active navigation
    await expect(lcarsPage.activeNavigationButton).toBeVisible();
  });

  test('should display and update stardate using page object', async () => {
    // Get initial stardate
    const initialStardate = await lcarsPage.getCurrentStardate();
    expect(initialStardate).toMatch(/^\d+\.\d+$/);

    // Wait for stardate update
    const updatedStardate = await lcarsPage.waitForStardateUpdate(initialStardate);
    expect(updatedStardate).not.toBe(initialStardate);
    expect(updatedStardate).toMatch(/^\d+\.\d+$/);
  });

  test('should display sensor readings with valid values using page object', async () => {
    // Test temperature
    const temperature = await lcarsPage.getSensorReading('Temperature:');
    expect(temperature).toMatch(/^\d+°C$/);

    // Test hull integrity
    const hullIntegrity = await lcarsPage.getSensorReading('Hull Integrity:');
    expect(hullIntegrity).toMatch(/^\d+%$/);

    // Test power levels
    const powerLevels = await lcarsPage.getSensorReading('Power Levels:');
    expect(powerLevels).toMatch(/^\d+%$/);
  });

  test('should display crew status information using page object', async () => {
    // Test personnel count
    const personnel = await lcarsPage.getCrewStatusValue('Personnel:');
    expect(personnel).toMatch(/^\d+$/);

    // Test on duty count
    const onDuty = await lcarsPage.getCrewStatusValue('On Duty:');
    expect(onDuty).toMatch(/^\d+$/);

    // Test medical status
    const medical = await lcarsPage.getCrewStatusValue('Medical:');
    expect(medical).toBe('NOMINAL');
  });

  test('should display and update time using page object', async () => {
    // Get initial time
    const initialTime = await lcarsPage.getCurrentTime();
    expect(initialTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);

    // Get date
    const currentDate = await lcarsPage.getCurrentDate();
    expect(currentDate).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);

    // Wait for time update
    const updatedTime = await lcarsPage.waitForTimeUpdate(initialTime);
    expect(updatedTime).not.toBe(initialTime);
    expect(updatedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  test('should display alerts using page object', async () => {
    const alertMessages = await lcarsPage.getAlertMessages();
    expect(alertMessages).toHaveLength(2);
    expect(alertMessages).toContain('SYSTEM NOMINAL');
    expect(alertMessages).toContain('ROUTINE MAINTENANCE DUE');
  });

  test('should display warp speed using page object', async () => {
    const warpSpeed = await lcarsPage.getWarpSpeed();
    expect(warpSpeed).toBe('0');
  });

  test('should interact with navigation buttons using page object', async () => {
    // Test clicking different navigation buttons
    await lcarsPage.clickNavigationButton('SENSORS');
    await expect(lcarsPage.navigationButtons.filter({ hasText: 'SENSORS' })).toBeVisible();

    await lcarsPage.clickNavigationButton('TACTICAL');
    await expect(lcarsPage.navigationButtons.filter({ hasText: 'TACTICAL' })).toBeVisible();

    await lcarsPage.clickNavigationButton('ENGINEERING');
    await expect(lcarsPage.navigationButtons.filter({ hasText: 'ENGINEERING' })).toBeVisible();
  });

  test('should have complete LCARS structure using page object', async () => {
    // Test main structure
    await expect(lcarsPage.statusScreen).toBeVisible();
    await expect(lcarsPage.statusScreenHeader).toContainText('BRIDGE OPERATIONS STATUS');

    // Test warp speed slider
    await expect(lcarsPage.warpSpeedSlider).toBeVisible();

    // Test alerts panel
    await expect(lcarsPage.alertsPanel).toBeVisible();

    // Test time display
    await expect(lcarsPage.timeDisplay).toBeVisible();

    // Test footer
    await expect(lcarsPage.footerBar).toBeVisible();
    await expect(lcarsPage.bottomLeftElbow).toBeVisible();
    await expect(lcarsPage.bottomRightElbow).toBeVisible();
  });
});