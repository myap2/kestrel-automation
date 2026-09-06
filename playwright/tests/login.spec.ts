import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AccountPage } from "../pages/AccountPage";
import { accounts } from "../fixtures/accounts";

test.describe("Login", () => {
  test("signs in with a standard account", async ({ page }) => {
    const login = new LoginPage(page);
    const account = new AccountPage(page);
    await login.goto();
    await login.signIn(accounts.standard.email, accounts.standard.password);
    await expect(account.name).toHaveText(accounts.standard.name);
    await expect(account.email).toHaveText(accounts.standard.email);
  });

  test("rejects a bad password", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.signIn(accounts.invalid.email, accounts.invalid.password);
    await login.expectError("Email or password is incorrect.");
    await expect(page).toHaveURL(/login\.html/);
  });

  test("blocks a locked account", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.signIn(accounts.locked.email, accounts.locked.password);
    await login.expectError(/account is locked/i);
  });
});
