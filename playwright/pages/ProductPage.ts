import { type Page, type Locator, expect } from "@playwright/test";

export class ProductPage {
  readonly title: Locator;
  readonly addToCart: Locator;
  readonly quantity: Locator;
  readonly flash: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId("product-title");
    this.addToCart = page.getByTestId("add-to-cart");
    this.quantity = page.getByTestId("quantity-input");
    this.flash = page.getByTestId("flash");
  }

  async goto(id: string) {
    await this.page.goto(`/product.html?id=${id}`);
  }

  async add(quantity = 1) {
    await this.quantity.fill(String(quantity));
    await this.addToCart.click();
    await expect(this.flash).toContainText("added to cart");
  }
}
