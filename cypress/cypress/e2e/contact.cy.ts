import { ContactPage } from "../support/pages/ContactPage";

describe("Contact", () => {
  it("sends a message to the shop desk", () => {
    const contact = new ContactPage();
    contact.visit();
    contact.send({
      name: "Jonah Pike",
      email: "jonah@example.com",
      topic: "Fit advice",
      message: "Do the Granite Trail Boots run true to size?",
    });
    cy.get('[data-testid="flash"]').should("contain.text", "Message sent");
    cy.get('[data-testid="contact-reference"]').invoke("text").should("match", /NOTE-\d+/);
  });
});
