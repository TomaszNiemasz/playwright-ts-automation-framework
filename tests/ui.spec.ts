import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('SauceDemo E2E Purchase Flow with POM', () => {

  test('should complete full purchase journey successfully', async ({ page }) => {
    // 1. Inicjalizacja wszystkich obiektów stron (Page Objects)
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 2. Proces logowania
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // 3. Wybór produktu i przejście do koszyka
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // 4. Przejście do formularza zamówienia (Checkout)
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // 5. Uzupełnienie danych adresowych
    await checkoutPage.fillShippingDetails('Jan', 'Kowalski', '00-001');
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    // 6. Sfinalizowanie zamówienia i weryfikacja komunikatu sukcesu
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(checkoutPage.successHeader).toHaveText('Thank you for your order!');
  });

});
