import type { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemNames = page.getByTestId("inventory-item-name");
    this.itemPrices = page.getByTestId("inventory-item-price");
    this.checkoutButton = page.getByTestId("checkout");
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
