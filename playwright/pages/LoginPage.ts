import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly flash: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByTestId("login-email");
    this.password = page.getByTestId("login-password");
    this.submit = page.getByTestId("login-submit");
    this.flash = page.getByTestId("flash");
  }

  async goto(next?: string) {
    await this.page.goto(next ? `/login.html?next=${encodeURIComponent(next)}` : "/login.html");
  }

  async signIn(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  async expectError(message: string | RegExp) {
    await expect(this.flash).toBeVisible();
    await expect(this.flash).toContainText(message);
    await expect(this.flash).toHaveClass(/error/);
  }
}
