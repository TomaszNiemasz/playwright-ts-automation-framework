import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Importujemy nasz Page Object

test.describe('UI Automation Tests with POM', () => {

  test('should login successfully using Page Object Model', async ({ page }) => {
    // 1. Inicjalizacja klasy strony logowania
    const loginPage = new LoginPage(page);

    // 2. Otworzenie strony przez metodę z POM
    await loginPage.goto();

    // 3. Zalogowanie się przy użyciu metody biznesowej
    await loginPage.login('standard_user', 'secret_sauce');

    // 4. Asercje sprawdzające poprawność logowania
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

});
