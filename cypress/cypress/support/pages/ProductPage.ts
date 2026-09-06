export class ProductPage {
  visit(id: string) {
    cy.visit(`/product.html?id=${id}`);
  }

  addToCart() {
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="flash"]').should("contain.text", "added to cart");
  }
}
