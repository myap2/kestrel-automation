import { test, expect } from "@playwright/test";
import { ShopPage } from "../pages/ShopPage";

test.describe("Shop catalog", () => {
  test("lists live products from the API", async ({ page }) => {
    const shop = new ShopPage(page);
    await shop.goto();
    await expect(shop.cards.first()).toBeVisible();
    await expect(shop.cards).toHaveCount(8);
    await shop.expectProduct("Ridgeline 2P Tent");
  });

  test("filters by search text", async ({ page }) => {
    const shop = new ShopPage(page);
    await shop.goto();
    await shop.searchFor("tent");
    await expect(shop.cards).toHaveCount(1);
    await shop.expectProduct("Ridgeline 2P Tent");
  });

  test("filters by category", async ({ page }) => {
    const shop = new ShopPage(page);
    await shop.goto();
    await shop.filterCategory("Apparel");
    await expect(shop.cards).toHaveCount(2);
    await shop.expectProduct("Summit Down Jacket");
    await shop.expectProduct("Merino Base Layer");
  });
});
