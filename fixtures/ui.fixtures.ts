import { test as base, expect } from '@playwright/test';
import { env } from '../config/env';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { OverviewPage } from '../pages/OverviewPage';

type UiFixtures = {
  /** Login page, user NOT logged in. Use it for tests of the login itself. */
  loginPage: LoginPage;
  /** Inventory page with the user ALREADY logged in as the standard user. */
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  overviewPage: OverviewPage;
  confirmationPage: ConfirmationPage;
};

export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login(env.uiUser.username, env.uiUser.password);
    const inventoryPage = new InventoryPage(page);
    // Fail fast with a clear message if the login did not work.
    await expect(inventoryPage.title).toHaveText('Products');
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  overviewPage: async ({ page }, use) => {
    await use(new OverviewPage(page));
  },

  confirmationPage: async ({ page }, use) => {
    await use(new ConfirmationPage(page));
  },
});

export { expect };
