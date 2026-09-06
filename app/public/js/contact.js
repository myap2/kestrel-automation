import { api, showFlash } from "./kestrel.js";

const form = document.querySelector("[data-testid='contact-form']");
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(form).entries());
  try {
    const result = await api("/api/contact", { method: "POST", body });
    form.reset();
    showFlash(`Message sent. Reference ${result.reference}.`, "success");
    const ref = document.querySelector("[data-testid='contact-reference']");
    if (ref) ref.textContent = result.reference;
  } catch (err) {
    showFlash(err.message, "error");
  }
});
