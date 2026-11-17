import { test, expect } from '../../fixtures/ui.fixtures';
import { validCustomer } from '../../test-data/customer';

const cases = [
  {
    scenario: 'all fields are empty',
    customer: { firstName: '', lastName: '', postalCode: '' },
    expectedError: 'First Name is required',
  },
  {
    scenario: 'first name is empty',
    customer: { ...validCustomer, firstName: '' },
    expectedError: 'First Name is required',
  },
  {
    scenario: 'last name is empty',
    customer: { ...validCustomer, lastName: '' },
    expectedError: 'Last Name is required',
  },
  {
    scenario: 'postal code is empty',
    customer: { ...validCustomer, postalCode: '' },
    expectedError: 'Postal Code is required',
  },
];

test.describe('Checkout form validation', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  for (const { scenario, customer, expectedError } of cases) {
    test(`shows "${expectedError}" when ${scenario}`, async ({ checkoutPage }) => {
      await checkoutPage.fillShippingDetails(customer);

      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toContainText(expectedError);
    });
  }
});
