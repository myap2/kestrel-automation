import { ShopPage } from "../support/pages/ShopPage";

describe("Shop catalog", () => {
  const shop = new ShopPage();

  it("lists live products from the API", () => {
    shop.visit();
    shop.cards().should("have.length", 8);
    shop.cards().should("contain.text", "Ridgeline 2P Tent");
  });

  it("filters by search text", () => {
    shop.visit();
    shop.search("tent");
    shop.cards().should("have.length", 1).and("contain.text", "Ridgeline 2P Tent");
  });

  it("filters by category", () => {
    shop.visit();
    shop.filterCategory("Apparel");
    shop.cards().should("have.length", 2);
    shop.cards().should("contain.text", "Summit Down Jacket");
    shop.cards().should("contain.text", "Merino Base Layer");
  });
});
