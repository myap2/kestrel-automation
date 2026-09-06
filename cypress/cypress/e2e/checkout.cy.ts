import { ProductPage } from "../support/pages/ProductPage";
import { CartPage } from "../support/pages/CartPage";
import { CheckoutPage } from "../support/pages/CheckoutPage";

describe("Cart and checkout", () => {
  it("adds a tent and places an order", () => {
    cy.loginAsStandard("/account.html");
    const product = new ProductPage();
    product.visit("ridgeline-2p");
    cy.get('[data-testid="product-title"]').should("have.text", "Ridgeline 2P Tent");
    product.addToCart();

    const cart = new CartPage();
    cart.visit();
    cy.get('[data-testid="cart-row"]').should("contain.text", "Ridgeline 2P Tent");
    cy.get('[data-testid="summary-subtotal"]').should("have.text", "$289.00");
    cart.checkout();

    const checkout = new CheckoutPage();
    checkout.fillShipping();
    checkout.placeOrder();

    cy.get('[data-testid="order-heading"]').should("be.visible");
    cy.get('[data-testid="order-id"]').invoke("text").should("match", /KES-\d+/);
    cy.get('[data-testid="order-total"]').should("have.text", "$289.00");
    cy.get('[data-testid="cart-count"]').should("have.text", "0");
  });
});
