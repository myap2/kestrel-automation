export class CheckoutPage {
  fillShipping() {
    cy.get('[data-testid="checkout-address"]').clear().type("412 Hood Street");
    cy.get('[data-testid="checkout-city"]').clear().type("Portland");
    cy.get('[data-testid="checkout-region"]').clear().type("OR");
    cy.get('[data-testid="checkout-postal"]').clear().type("97214");
  }

  placeOrder() {
    cy.get('[data-testid="place-order"]').click();
  }
}
