export class ContactPage {
  visit() {
    cy.visit("/contact.html");
  }

  send(data: { name: string; email: string; topic?: string; message: string }) {
    cy.get('[data-testid="contact-name"]').type(data.name);
    cy.get('[data-testid="contact-email"]').type(data.email);
    if (data.topic) cy.get('[data-testid="contact-topic"]').select(data.topic);
    cy.get('[data-testid="contact-message"]').type(data.message);
    cy.get('[data-testid="contact-submit"]').click();
  }
}
