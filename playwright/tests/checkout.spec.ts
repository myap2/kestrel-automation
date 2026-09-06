import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { accounts } from "../fixtures/accounts";

test.describe("Cart and checkout", () => {
  test("adds a tent and places an order", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto("/checkout.html");
    await login.signIn(accounts.standard.email, accounts.standard.password);

    const product = new ProductPage(page);
    await product.goto("ridgeline-2p");
    await expect(product.title).toHaveText("Ridgeline 2P Tent");
    await product.add(1);

    const cart = new CartPage(page);
    await cart.goto();
    await cart.expectItem("Ridgeline 2P Tent");
    await expect(cart.subtotal).toHaveText("$289.00");
    await cart.checkout.click();

    const checkout = new CheckoutPage(page);
    await checkout.fillShipping();
    await checkout.place();

    await expect(page.getByTestId("order-heading")).toBeVisible();
    await expect(page.getByTestId("order-id")).toHaveText(/KES-\d+/);
    await expect(page.getByTestId("order-total")).toHaveText("$289.00");
    await expect(page.getByTestId("cart-count")).toHaveText("0");
  });
});
