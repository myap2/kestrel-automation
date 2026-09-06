import { test, expect } from "@playwright/test";
import { ShopPage } from "../pages/ShopPage";
import emptyCatalog from "../mocks/products.empty.json";
import ghostCatalog from "../mocks/products.ghost.json";

const productsUrl = /\/api\/products(\?.*)?$/;

test.describe("Catalog network mocks", () => {
  test("renders an empty state when the API returns no products", async ({ page }) => {
    await page.route(productsUrl, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(emptyCatalog),
      });
    });
    const shop = new ShopPage(page);
    await shop.goto();
    await expect(shop.empty).toBeVisible();
    await expect(shop.empty).toContainText("No gear matches that search");
    await expect(shop.cards).toHaveCount(0);
  });

  test("renders an error panel when the product service fails", async ({ page }) => {
    await page.route(productsUrl, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Product service down" }),
      });
    });
    const shop = new ShopPage(page);
    await shop.goto();
    await expect(shop.error).toBeVisible();
    await expect(shop.error).toContainText("Catalog unavailable");
  });

  test("renders fixture products instead of the live catalog", async ({ page }) => {
    await page.route(productsUrl, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(ghostCatalog),
      });
    });
    const shop = new ShopPage(page);
    await shop.goto();
    await expect(shop.cards).toHaveCount(1);
    await shop.expectProduct("Ghost Quilt");
    await expect(shop.cards.filter({ hasText: "Ridgeline 2P Tent" })).toHaveCount(0);
  });
});
