import { type Page, type Locator, expect } from "@playwright/test";

export class ContactPage {
  readonly name: Locator;
  readonly email: Locator;
  readonly topic: Locator;
  readonly message: Locator;
  readonly submit: Locator;
  readonly flash: Locator;
  readonly reference: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByTestId("contact-name");
    this.email = page.getByTestId("contact-email");
    this.topic = page.getByTestId("contact-topic");
    this.message = page.getByTestId("contact-message");
    this.submit = page.getByTestId("contact-submit");
    this.flash = page.getByTestId("flash");
    this.reference = page.getByTestId("contact-reference");
  }

  async goto() {
    await this.page.goto("/contact.html");
  }

  async send(data: { name: string; email: string; topic?: string; message: string }) {
    await this.name.fill(data.name);
    await this.email.fill(data.email);
    if (data.topic) await this.topic.selectOption(data.topic);
    await this.message.fill(data.message);
    await this.submit.click();
    await expect(this.flash).toContainText("Message sent");
  }
}
