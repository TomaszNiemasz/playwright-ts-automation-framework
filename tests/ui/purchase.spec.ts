import { test, expect } from "../../fixtures/ui.fixtures";
import { validCustomer } from "../../test-data/customer";
import { formatCents, toCents } from "../../utils/money";

const BACKPACK = "Sauce Labs Backpack";
const BIKE_LIGHT = "Sauce Labs Bike Light";

test.describe("Purchase flow", () => {
  test(
    "user can buy a single product",
    { tag: "@smoke" },
    async ({
      inventoryPage,
      cartPage,
      checkoutPage,
      overviewPage,
      confirmationPage,
    }) => {
      const price = await inventoryPage.getProductPrice(BACKPACK);

      await inventoryPage.addToCart(BACKPACK);
      await expect(inventoryPage.cartBadge).toHaveText("1");
      await inventoryPage.goToCart();

      await expect(cartPage.itemNames).toHaveText([BACKPACK]);
      await expect(cartPage.itemPrices).toHaveText([price]);
      await cartPage.proceedToCheckout();

      await checkoutPage.fillShippingDetails(validCustomer);

      await expect(overviewPage.itemNames).toHaveText([BACKPACK]);
      await expect(overviewPage.subtotal).toHaveText(`Item total: ${price}`);
      await overviewPage.finish();

      await expect(confirmationPage.header).toHaveText(
        "Thank you for your order!",
      );
    },
  );

  test("order subtotal equals the sum of the product prices", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    overviewPage,
  }) => {
    const backpackPrice = await inventoryPage.getProductPrice(BACKPACK);
    const bikeLightPrice = await inventoryPage.getProductPrice(BIKE_LIGHT);
    const expectedSubtotal = formatCents(
      toCents(backpackPrice) + toCents(bikeLightPrice),
    );

    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await expect(inventoryPage.cartBadge).toHaveText("2");
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetails(validCustomer);

    await expect(overviewPage.subtotal).toHaveText(
      `Item total: ${expectedSubtotal}`,
    );
  });
});
