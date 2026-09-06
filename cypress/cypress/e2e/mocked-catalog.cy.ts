import { ShopPage } from "../support/pages/ShopPage";

const productsUrl = /\/api\/products(\?.*)?$/;

describe("Catalog network mocks", () => {
  const shop = new ShopPage();

  it("renders an empty state when the API returns no products", () => {
    cy.intercept("GET", productsUrl, { fixture: "products.empty.json" }).as("emptyProducts");
    shop.visit();
    cy.wait("@emptyProducts");
    cy.get('[data-testid="empty-catalog"]').should("be.visible");
    shop.cards().should("have.length", 0);
  });

  it("renders an error panel when the product service fails", () => {
    cy.intercept("GET", productsUrl, {
      statusCode: 500,
      body: { message: "Product service down" },
    }).as("failedProducts");
    shop.visit();
    cy.wait("@failedProducts");
    cy.get('[data-testid="catalog-error"]').should("be.visible").and("contain.text", "Catalog unavailable");
  });

  it("renders fixture products instead of the live catalog", () => {
    cy.intercept("GET", productsUrl, { fixture: "products.ghost.json" }).as("ghostProducts");
    shop.visit();
    cy.wait("@ghostProducts");
    shop.cards().should("have.length", 1).and("contain.text", "Ghost Quilt");
    shop.cards().should("not.contain.text", "Ridgeline 2P Tent");
  });
});
