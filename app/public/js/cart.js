import { api, money, refreshChrome, showFlash } from "./kestrel.js";

const root = document.querySelector("[data-testid='cart-page']");

async function render() {
  const cart = await api("/api/cart");
  if (cart.items.length === 0) {
    root.innerHTML = `
      <div class="empty" data-testid="empty-cart">
        <p class="eyebrow">Cart</p>
        <h2>Nothing packed yet</h2>
        <p>The shop is through the door on the left.</p>
        <p><a class="btn" href="/shop.html">Browse the catalog</a></p>
      </div>`;
    return;
  }
  root.innerHTML = `
    <div class="split">
      <table class="cart-table" data-testid="cart-table">
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          ${cart.items
            .map(
              (item) => `
            <tr data-testid="cart-row" data-product-id="${item.productId}">
              <td>
                <div class="cart-item">
                  <img src="${item.image}" alt="">
                  <div>
                    <strong data-testid="cart-item-name">${item.name}</strong>
                    <div class="note">${money(item.price)} each</div>
                  </div>
                </div>
              </td>
              <td data-testid="cart-item-qty">${item.quantity}</td>
              <td>${money(item.lineTotal)}</td>
              <td><button class="btn btn-ghost" data-testid="remove-item" data-product-id="${item.productId}">Remove</button></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <aside class="summary">
        <p class="eyebrow">Summary</p>
        <h2>Ready to ship</h2>
        <dl>
          <dt>Items</dt><dd data-testid="summary-count">${cart.itemCount}</dd>
          <dt>Subtotal</dt><dd data-testid="summary-subtotal">${money(cart.subtotal)}</dd>
        </dl>
        <p><a class="btn" href="/checkout.html" data-testid="checkout-link">Continue to checkout</a></p>
        <div class="flash" data-testid="flash" role="status"></div>
      </aside>
    </div>
  `;
  root.querySelectorAll("[data-testid='remove-item']").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/cart/items/${button.dataset.productId}`, { method: "DELETE" });
      await refreshChrome();
      await render();
      showFlash("Item removed.", "success");
    });
  });
}

render();
