import { type Page, type Locator } from "@playwright/test";

export class AccountPage {
  readonly name: Locator;
  readonly email: Locator;
  readonly logout: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByTestId("account-name");
    this.email = page.getByTestId("account-email");
    this.logout = page.getByTestId("logout-button");
  }
}
