import { api, refreshChrome, showFlash } from "./kestrel.js";

const loginForm = document.querySelector("[data-testid='login-form']");
const registerForm = document.querySelector("[data-testid='register-form']");
const logoutButton = document.querySelector("[data-testid='logout-button']");
const next = new URLSearchParams(location.search).get("next") || "/account.html";

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;
  try {
    await api("/api/auth/login", { method: "POST", body: { email, password } });
    await refreshChrome();
    location.href = next;
  } catch (err) {
    showFlash(err.message, "error");
  }
});

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = {
    name: registerForm.name.value.trim(),
    email: registerForm.email.value.trim(),
    password: registerForm.password.value,
  };
  try {
    await api("/api/auth/register", { method: "POST", body });
    await refreshChrome();
    location.href = "/account.html";
  } catch (err) {
    showFlash(err.message, "error");
  }
});

logoutButton?.addEventListener("click", async () => {
  await api("/api/auth/logout", { method: "POST", body: {} });
  location.href = "/login.html";
});

const accountName = document.querySelector("[data-testid='account-name']");
if (accountName) {
  const { user } = await api("/api/auth/me");
  if (!user) location.href = "/login.html";
  else {
    accountName.textContent = user.name;
    document.querySelector("[data-testid='account-email']").textContent = user.email;
  }
}
