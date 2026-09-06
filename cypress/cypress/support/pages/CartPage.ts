export class CartPage {
  visit() {
    cy.visit("/cart.html");
  }

  checkout() {
    cy.get('[data-testid="checkout-link"]').click();
  }
}
