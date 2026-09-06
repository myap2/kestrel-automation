import { type Page, type Locator, expect } from "@playwright/test";

export class CartPage {
  readonly empty: Locator;
  readonly rows: Locator;
  readonly checkout: Locator;
  readonly subtotal: Locator;

  constructor(private readonly page: Page) {
    this.empty = page.getByTestId("empty-cart");
    this.rows = page.getByTestId("cart-row");
    this.checkout = page.getByTestId("checkout-link");
    this.subtotal = page.getByTestId("summary-subtotal");
  }

  async goto() {
    await this.page.goto("/cart.html");
  }

  async expectItem(name: string) {
    await expect(this.rows.filter({ hasText: name })).toBeVisible();
  }
}
