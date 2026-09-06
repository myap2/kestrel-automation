export class ShopPage {
  visit() {
    cy.visit("/shop.html");
  }

  search(term: string) {
    cy.get('[data-testid="search-input"]').clear().type(term);
  }

  filterCategory(name: string) {
    cy.get('[data-testid="category-chip"]').contains(name).click();
  }

  cards() {
    return cy.get('[data-testid="product-card"]');
  }
}
