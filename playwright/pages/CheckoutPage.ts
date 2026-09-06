import { type Page, type Locator } from "@playwright/test";

export class CheckoutPage {
  readonly name: Locator;
  readonly email: Locator;
  readonly address: Locator;
  readonly city: Locator;
  readonly region: Locator;
  readonly postal: Locator;
  readonly placeOrder: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByTestId("checkout-name");
    this.email = page.getByTestId("checkout-email");
    this.address = page.getByTestId("checkout-address");
    this.city = page.getByTestId("checkout-city");
    this.region = page.getByTestId("checkout-region");
    this.postal = page.getByTestId("checkout-postal");
    this.placeOrder = page.getByTestId("place-order");
  }

  async goto() {
    await this.page.goto("/checkout.html");
  }

  async fillShipping(overrides: Partial<Record<"name" | "email" | "address" | "city" | "region" | "postal", string>> = {}) {
    const shipping = {
      address: "412 Hood Street",
      city: "Portland",
      region: "OR",
      postal: "97214",
      ...overrides,
    };
    if (shipping.name) await this.name.fill(shipping.name);
    if (shipping.email) await this.email.fill(shipping.email);
    await this.address.fill(shipping.address);
    await this.city.fill(shipping.city);
    await this.region.fill(shipping.region);
    await this.postal.fill(shipping.postal);
  }

  async place() {
    await this.placeOrder.click();
  }
}
