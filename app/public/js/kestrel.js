const KESTREL_MARK = `<svg viewBox="0 0 32 32" aria-hidden="true">
  <path fill="#b85a32" d="M16 2c2.8 4.4 8.2 8.1 8.2 13.4A8.2 8.2 0 0 1 16 23.6 8.2 8.2 0 0 1 7.8 15.4C7.8 10.1 13.2 6.4 16 2z"/>
  <path fill="#24362c" d="M16 11.2c4.8 1.4 8 5.2 8 9.6C24 26.6 20.4 30 16 30s-8-3.4-8-9.2c0-4.4 3.2-8.2 8-9.6z"/>
</svg>`;

export async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function showFlash(message, type = "error") {
  const el = document.querySelector("[data-testid='flash']");
  if (!el) return;
  el.textContent = message;
  el.className = `flash is-visible ${type}`;
  el.dataset.state = type;
}

export function hideFlash() {
  const el = document.querySelector("[data-testid='flash']");
  if (!el) return;
  el.className = "flash";
  el.textContent = "";
  el.dataset.state = "";
}

function currentPath() {
  const file = location.pathname.split("/").pop() || "index.html";
  return file === "" ? "index.html" : file;
}

export function mountChrome() {
  const header = document.querySelector("[data-chrome]");
  const footer = document.querySelector("[data-footer]");
  const page = currentPath();
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <div class="wrap header-inner">
          <a class="brand" href="/index.html" data-testid="brand-link">${KESTREL_MARK}<span>Kestrel</span></a>
          <nav class="nav" aria-label="Primary">
            <a href="/index.html" data-testid="nav-home" ${page === "index.html" ? 'aria-current="page"' : ""}>Home</a>
            <a href="/shop.html" data-testid="nav-shop" ${page === "shop.html" ? 'aria-current="page"' : ""}>Shop</a>
            <a href="/contact.html" data-testid="nav-contact" ${page === "contact.html" ? 'aria-current="page"' : ""}>Contact</a>
          </nav>
          <div class="header-actions">
            <a class="account-link" href="/login.html" data-testid="nav-account">Sign in</a>
            <a class="cart-link" href="/cart.html" data-testid="nav-cart">
              Cart <span class="cart-count" data-testid="cart-count">0</span>
            </a>
          </div>
        </div>
      </header>
    `;
  }
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="wrap footer-grid">
          <div>
            <div class="brand">${KESTREL_MARK}<span>Kestrel Outfitters</span></div>
            <p>Trail gear cut for wet rock, cold mornings, and the long walk out.</p>
          </div>
          <div>
            <p class="eyebrow">Visit</p>
            <p>412 Hood Street<br>Portland, OR 97214</p>
          </div>
          <div>
            <p class="eyebrow">Hours</p>
            <p>Tue–Sun, 10–6<br>Closed Mondays</p>
          </div>
        </div>
        <div class="wrap legal">Demo storefront for UI automation. Catalog and accounts are seeded on purpose.</div>
      </footer>
    `;
  }
}

export async function refreshChrome() {
  const [cart, me] = await Promise.all([
    api("/api/cart").catch(() => ({ itemCount: 0 })),
    api("/api/auth/me").catch(() => ({ user: null })),
  ]);
  const count = document.querySelector("[data-testid='cart-count']");
  if (count) count.textContent = String(cart.itemCount || 0);
  const account = document.querySelector("[data-testid='nav-account']");
  if (account) {
    if (me.user) {
      account.textContent = me.user.name;
      account.href = "/account.html";
      account.dataset.authenticated = "true";
    } else {
      account.textContent = "Sign in";
      account.href = "/login.html";
      account.dataset.authenticated = "false";
    }
  }
  return { cart, user: me.user };
}

export function productCard(product) {
  return `
    <article class="product-card" data-testid="product-card" data-product-id="${product.id}">
      <a href="/product.html?id=${product.id}" data-testid="product-link">
        <img src="${product.image}" alt="${product.name}">
      </a>
      <div class="product-card-body">
        <p class="eyebrow">${product.category}</p>
        <h3 data-testid="product-name">${product.name}</h3>
        <p class="product-meta">${product.blurb}</p>
        <p class="price" data-testid="product-price">${money(product.price)}</p>
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  mountChrome();
  await refreshChrome();
});
