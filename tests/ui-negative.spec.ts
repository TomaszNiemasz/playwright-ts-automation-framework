import { test, expect } from '../fixtures/fixtures'; // Dopasuj ścieżkę do folderu fixtures
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('SauceDemo Checkout - Form Validation (Negative Tests)', () => {

  test('should show error when trying to continue checkout with empty fields', async ({ page, inventoryPage }) => {
    // Dodanie produktu i przejście do koszyka
    await inventoryPage.addFirstProductToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    // Próba kliknięcia zatwierdzenia bez wpisania jakichkolwiek danych
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.clickContinue();

    // Weryfikacja, czy aplikacja wyświetla stosowny komunikat o błędzie
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('First Name is required');
  });

  test('should show error when postal code is missing', async ({ page, inventoryPage }) => {
    await inventoryPage.addFirstProductToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    
    // Próba kliknięcia zatwierdzenia z pustym kodem pocztowym
    await checkoutPage.fillShippingDetails('Jan', 'Kowalski', '');

    // Weryfikacja błędu dla kodu pocztowego
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

});
