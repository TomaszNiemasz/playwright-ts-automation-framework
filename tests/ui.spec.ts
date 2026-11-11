import { test, expect } from '@playwright/test';

test.describe('UI Automation Tests', () => {

  test('should login successfully with standard user', async ({ page }) => {
    // 1. Wejdź na stronę logowania SauceDemo
    await page.goto('https://www.saucedemo.com/');

    // 2. Wpisz login (standardowy user z platformy testowej)
    await page.fill('#user-name', 'standard_user');

    // 3. Wpisz hasło
    await page.fill('#password', 'secret_sauce');

    // 4. Kliknij przycisk Login
    await page.click('#login-button');

    // 5. Sprawdzimy, czy zalogowało nas poprawnie (np. czy URL zmienił się na podstronę inventory)
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // 6. Sprawdzimy, czy widoczny jest nagłówek z produktami (ikonka koszyka)
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

});
