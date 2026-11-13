import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly successHeader: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.successHeader = page.getByTestId('complete-header');
    this.errorMessage = page.getByTestId('error');
  }
  // Przejście do kolejnego kroku formularza
  async clickContinue() {
    await this.continueButton.click();
  }

  // Wypełnienie danych adresowych i przejście dalej
  async fillShippingDetails(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.clickContinue();
  }

  // Sfinalizowanie zamówienia (Finish)
  async finishOrder() {
    await this.finishButton.click();
  }
}
