import { type Page, type Locator, expect } from "@playwright/test";

export class ShopPage {
  readonly search: Locator;
  readonly grid: Locator;
  readonly cards: Locator;
  readonly empty: Locator;
  readonly error: Locator;
  readonly resultCount: Locator;

  constructor(private readonly page: Page) {
    this.search = page.getByTestId("search-input");
    this.grid = page.getByTestId("product-grid");
    this.cards = page.getByTestId("product-card");
    this.empty = page.getByTestId("empty-catalog");
    this.error = page.getByTestId("catalog-error");
    this.resultCount = page.getByTestId("result-count");
  }

  async goto() {
    await this.page.goto("/shop.html");
  }

  async searchFor(term: string) {
    await this.search.fill(term);
  }

  async filterCategory(name: string) {
    await this.page.getByTestId("category-chip").filter({ hasText: name }).click();
  }

  async openProduct(name: string) {
    await this.cards.filter({ hasText: name }).getByTestId("product-link").click();
  }

  async expectProduct(name: string) {
    await expect(this.cards.filter({ hasText: name })).toBeVisible();
  }
}
