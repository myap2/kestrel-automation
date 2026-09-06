import { test, expect } from "@playwright/test";
import { ContactPage } from "../pages/ContactPage";

test("sends a message to the shop desk", async ({ page }) => {
  const contact = new ContactPage(page);
  await contact.goto();
  await contact.send({
    name: "Jonah Pike",
    email: "jonah@example.com",
    topic: "Fit advice",
    message: "Do the Granite Trail Boots run true to size?",
  });
  await expect(contact.reference).toHaveText(/NOTE-\d+/);
});
