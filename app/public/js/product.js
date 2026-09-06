import { api, money, refreshChrome, showFlash } from "./kestrel.js";

const id = new URLSearchParams(location.search).get("id");
const root = document.querySelector("[data-testid='product-page']");

async function render() {
  if (!id) {
    root.innerHTML = `<div class="error-panel" data-testid="product-missing"><h2>Product not found</h2></div>`;
    return;
  }
  try {
    const { product } = await api(`/api/products/${id}`);
    document.title = `${product.name} · Kestrel Outfitters`;
    root.innerHTML = `
      <section class="split wrap" style="padding-top: 36px;">
        <div class="product-photo">
          <img src="${product.image}" alt="${product.name}" data-testid="product-image">
        </div>
        <div class="product-copy">
          <p class="eyebrow" data-testid="product-category">${product.category}</p>
          <h1 data-testid="product-title">${product.name}</h1>
          <p class="price" data-testid="product-price">${money(product.price)}</p>
          <p data-testid="product-description">${product.description}</p>
          <p class="note">SKU ${product.sku} · ${product.weight}</p>
          <form class="qty-row" data-testid="add-to-cart-form">
            <label>
              Qty
              <input class="field" type="number" min="1" max="9" value="1" name="quantity" data-testid="quantity-input">
            </label>
            <button class="btn" type="submit" data-testid="add-to-cart">Add to cart</button>
          </form>
          <div class="flash" data-testid="flash" role="status"></div>
        </div>
      </section>
    `;
    root.querySelector("form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const quantity = Number(event.target.quantity.value || 1);
      try {
        await api("/api/cart/items", { method: "POST", body: { productId: product.id, quantity } });
        await refreshChrome();
        showFlash(`${product.name} added to cart.`, "success");
      } catch (err) {
        showFlash(err.message, "error");
      }
    });
  } catch {
    root.innerHTML = `<div class="error-panel" data-testid="product-missing"><h2>Product not found</h2><p>That piece is no longer in the catalog.</p></div>`;
  }
}

render();
