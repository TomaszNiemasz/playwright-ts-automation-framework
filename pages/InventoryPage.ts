import type { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  /** The card of one product, found by its visible name. */
  private product(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({ hasText: name });
  }

  async addToCart(productName: string) {
    await this.product(productName).getByRole('button', { name: 'Add to cart'}).click();
  }

  /** Price exactly as displayed, e.g. "$29.99". */
  async getProductPrice(productName: string): Promise<string> {
    return this.product(productName).getByTestId('inventory-item-price').innerText();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
