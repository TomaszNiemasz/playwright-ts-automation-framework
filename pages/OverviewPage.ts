import type { Locator, Page } from '@playwright/test';

export class OverviewPage {
  readonly page: Page;
  readonly itemNames: Locator;
  readonly subtotal: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemNames = page.getByTestId('inventory-item-name');
    this.subtotal = page.getByTestId('subtotal-label');
    this.finishButton = page.getByTestId('finish');
  }

  async finish() {
    await this.finishButton.click();
  }
}
