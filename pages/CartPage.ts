import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByTestId('checkout');
  }

  // Przejście do formularza zamówienia
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
