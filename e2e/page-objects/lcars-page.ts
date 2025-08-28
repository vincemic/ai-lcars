import { Page, Locator } from '@playwright/test';

export class LCARSPage {
  readonly page: Page;
  
  // Header elements
  readonly headerTitle: Locator;
  readonly topLeftElbow: Locator;
  readonly topRightElbow: Locator;
  
  // Navigation panel
  readonly navigationButtons: Locator;
  readonly activeNavigationButton: Locator;
  readonly stardateDisplay: Locator;
  readonly stardateValue: Locator;
  
  // Status display
  readonly statusScreen: Locator;
  readonly statusScreenHeader: Locator;
  readonly statusItems: Locator;
  readonly sensorReadings: Locator;
  readonly crewStatus: Locator;
  
  // Right panel
  readonly warpSpeedSlider: Locator;
  readonly warpSpeedValue: Locator;
  readonly alertsPanel: Locator;
  readonly alertItems: Locator;
  readonly timeDisplay: Locator;
  readonly timeValue: Locator;
  readonly dateValue: Locator;
  
  // Footer
  readonly footerBar: Locator;
  readonly bottomLeftElbow: Locator;
  readonly bottomRightElbow: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header elements
    this.headerTitle = page.locator('.lcars-header .lcars-text');
    this.topLeftElbow = page.locator('.lcars-elbow.top-left');
    this.topRightElbow = page.locator('.lcars-elbow.top-right');
    
    // Navigation panel
    this.navigationButtons = page.locator('.lcars-button');
    this.activeNavigationButton = page.locator('.lcars-button.active');
    this.stardateDisplay = page.locator('.lcars-text-display').filter({ hasText: 'STARDATE' });
    this.stardateValue = page.locator('.lcars-data');
    
    // Status display
    this.statusScreen = page.locator('.lcars-screen');
    this.statusScreenHeader = page.locator('.lcars-screen-header');
    this.statusItems = page.locator('.status-item');
    this.sensorReadings = page.locator('h3').filter({ hasText: 'SENSOR READINGS' });
    this.crewStatus = page.locator('h3').filter({ hasText: 'CREW STATUS' });
    
    // Right panel
    this.warpSpeedSlider = page.locator('.lcars-slider');
    this.warpSpeedValue = page.locator('.slider-value');
    this.alertsPanel = page.locator('.lcars-alert-panel');
    this.alertItems = page.locator('.alert-item');
    this.timeDisplay = page.locator('.lcars-time-display');
    this.timeValue = page.locator('.time-value');
    this.dateValue = page.locator('.date-value');
    
    // Footer
    this.footerBar = page.locator('.lcars-bar.footer-bar');
    this.bottomLeftElbow = page.locator('.lcars-elbow.bottom-left');
    this.bottomRightElbow = page.locator('.lcars-elbow.bottom-right');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickNavigationButton(buttonText: string) {
    await this.navigationButtons.filter({ hasText: buttonText }).click();
  }

  async getNavigationButtonTexts(): Promise<string[]> {
    const buttons = await this.navigationButtons.all();
    const texts: string[] = [];
    for (const button of buttons) {
      const text = await button.textContent();
      if (text) texts.push(text);
    }
    return texts;
  }

  async getCurrentStardate(): Promise<string> {
    const stardateText = await this.stardateValue.textContent();
    return stardateText || '';
  }

  async getSensorReading(label: string): Promise<string> {
    const dataLine = this.page.locator('.data-line').filter({ hasText: label });
    const value = await dataLine.locator('.data-value').textContent();
    return value || '';
  }

  async getCrewStatusValue(label: string): Promise<string> {
    const dataLine = this.page.locator('.data-line').filter({ hasText: label });
    const value = await dataLine.locator('.data-value').textContent();
    return value || '';
  }

  async getCurrentTime(): Promise<string> {
    const timeText = await this.timeValue.textContent();
    return timeText || '';
  }

  async getCurrentDate(): Promise<string> {
    const dateText = await this.dateValue.textContent();
    return dateText || '';
  }

  async getAlertMessages(): Promise<string[]> {
    const alerts = await this.alertItems.all();
    const messages: string[] = [];
    for (const alert of alerts) {
      const text = await alert.textContent();
      if (text) messages.push(text);
    }
    return messages;
  }

  async getWarpSpeed(): Promise<string> {
    const warpText = await this.warpSpeedValue.textContent();
    return warpText || '';
  }

  async waitForStardateUpdate(initialStardate: string, timeoutMs: number = 10000): Promise<string> {
    await this.page.waitForFunction(
      (initial) => {
        const element = document.querySelector('.lcars-data');
        return element?.textContent !== initial;
      },
      initialStardate,
      { timeout: timeoutMs }
    );
    return this.getCurrentStardate();
  }

  async waitForTimeUpdate(initialTime: string, timeoutMs: number = 5000): Promise<string> {
    await this.page.waitForFunction(
      (initial) => {
        const element = document.querySelector('.time-value');
        return element?.textContent !== initial;
      },
      initialTime,
      { timeout: timeoutMs }
    );
    return this.getCurrentTime();
  }
}