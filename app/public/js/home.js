import { api, productCard } from "./kestrel.js";

async function renderFeatured() {
  const root = document.querySelector("[data-testid='featured-grid']");
  if (!root) return;
  try {
    const { products } = await api("/api/products");
    const featured = products.filter((p) => p.featured).slice(0, 4);
    root.innerHTML = featured.map(productCard).join("");
  } catch {
    root.innerHTML = `<div class="error-panel" data-testid="catalog-error"><h2>Catalog unavailable</h2><p>We could not load featured gear.</p></div>`;
  }
}

renderFeatured();
