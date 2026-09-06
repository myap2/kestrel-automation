import { api, money, refreshChrome, showFlash } from "./kestrel.js";

const form = document.querySelector("[data-testid='checkout-form']");
const summary = document.querySelector("[data-testid='checkout-summary']");

async function boot() {
  const [{ user }, cart] = await Promise.all([api("/api/auth/me"), api("/api/cart")]);
  if (!user) {
    location.href = `/login.html?next=${encodeURIComponent("/checkout.html")}`;
    return;
  }
  if (cart.items.length === 0) {
    location.href = "/cart.html";
    return;
  }
  form.elements.name.value = user.name;
  form.elements.email.value = user.email;
  summary.innerHTML = `
    ${cart.items.map((item) => `<p>${item.quantity} × ${item.name}</p>`).join("")}
    <p><strong data-testid="checkout-total">${money(cart.subtotal)}</strong></p>
  `;
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(form).entries());
  try {
    const { order } = await api("/api/checkout", { method: "POST", body });
    await refreshChrome();
    location.href = `/order.html?id=${encodeURIComponent(order.id)}&total=${encodeURIComponent(order.total)}`;
  } catch (err) {
    showFlash(err.message, "error");
  }
});

boot();
