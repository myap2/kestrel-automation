import { api, productCard, showFlash } from "./kestrel.js";

const params = new URLSearchParams(location.search);
const state = {
  q: params.get("q") || "",
  category: params.get("category") || "All",
  sort: params.get("sort") || "featured",
};

const search = document.querySelector("[data-testid='search-input']");
const sort = document.querySelector("[data-testid='sort-select']");
const chips = document.querySelector("[data-testid='category-chips']");
const grid = document.querySelector("[data-testid='product-grid']");
const resultCount = document.querySelector("[data-testid='result-count']");

if (search) search.value = state.q;
if (sort) sort.value = state.sort;

function syncUrl() {
  const next = new URL(location.href);
  if (state.q) next.searchParams.set("q", state.q);
  else next.searchParams.delete("q");
  if (state.category && state.category !== "All") next.searchParams.set("category", state.category);
  else next.searchParams.delete("category");
  if (state.sort !== "featured") next.searchParams.set("sort", state.sort);
  else next.searchParams.delete("sort");
  history.replaceState({}, "", next);
}

async function loadCategories() {
  const { categories } = await api("/api/categories");
  const all = ["All", ...categories];
  chips.innerHTML = all
    .map(
      (name) =>
        `<button type="button" class="chip" data-testid="category-chip" data-category="${name}" aria-pressed="${
          name === state.category
        }">${name}</button>`
    )
    .join("");
}

async function loadProducts() {
  grid.innerHTML = "";
  try {
    const query = new URLSearchParams();
    if (state.q) query.set("q", state.q);
    if (state.category !== "All") query.set("category", state.category);
    query.set("sort", state.sort);
    const { products } = await api(`/api/products?${query.toString()}`);
    resultCount.textContent = `${products.length} piece${products.length === 1 ? "" : "s"}`;
    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty" data-testid="empty-catalog">
          <p class="eyebrow">Catalog</p>
          <h2>No gear matches that search</h2>
          <p>Try another word, or clear the filters.</p>
        </div>`;
      return;
    }
    grid.innerHTML = products.map(productCard).join("");
  } catch (err) {
    resultCount.textContent = "0 pieces";
    grid.innerHTML = `
      <div class="error-panel" data-testid="catalog-error">
        <h2>Catalog unavailable</h2>
        <p>${err.message || "The product service did not respond."}</p>
      </div>`;
    showFlash(err.message || "Could not load products.", "error");
  }
}

search?.addEventListener("input", async (event) => {
  state.q = event.target.value;
  syncUrl();
  await loadProducts();
});

sort?.addEventListener("change", async (event) => {
  state.sort = event.target.value;
  syncUrl();
  await loadProducts();
});

chips?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  chips.querySelectorAll("[data-category]").forEach((el) => {
    el.setAttribute("aria-pressed", String(el === button));
  });
  syncUrl();
  await loadProducts();
});

await loadCategories();
await loadProducts();
