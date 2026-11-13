import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartBackpackButton: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Lokator do przycisku dodania plecaka do koszyka
    this.addToCartBackpackButton = page.getByTestId('add-to-cart-sauce-labs-backpack');
    // Ikona koszyka
    this.shoppingCartLink = page.getByTestId('shopping-cart-link');
  }

  // Dodanie produktu do koszyka
  async addFirstProductToCart() {
    await this.addToCartBackpackButton.click();
  }

  // Przejście do koszyka
  async goToCart() {
    await this.shoppingCartLink.click();
  }
}
