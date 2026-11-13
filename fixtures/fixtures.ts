// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// Definicja typów dla niestandardowych fixtures
type MyFixtures = {
  inventoryPage: InventoryPage;
};

export const test = base.extend<MyFixtures>({
  // Fixture automatycznie loguje użytkownika przed testem
  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Pobranie danych z procesu (obsługiwane przez .env / GitHub Secrets)
    const username = process.env.STANDARD_USER || 'standard_user';
    const password = process.env.STANDARD_PASS || 'secret_sauce';
    
    await loginPage.login(username, password);

    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
