import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartBackpackButton: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Lokator do przycisku dodania plecaka do koszyka
    this.addToCartBackpackButton = page.locator('#add-to-cart-sauce-labs-backpack');
    // Ikona koszyka
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  // Metoda dodająca produkt do koszyka
  async addBackpackToCart() {
    await this.addToCartBackpackButton.click();
  }

  // Przejście do koszyka
  async goToCart() {
    await this.shoppingCartLink.click();
  }
}
