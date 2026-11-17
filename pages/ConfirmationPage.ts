import type { Locator, Page } from "@playwright/test";

/** "Thank you for your order" page. */
export class ConfirmationPage {
  readonly page: Page;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId("complete-header");
  }
}
