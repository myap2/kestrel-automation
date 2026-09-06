import { accounts } from "./accounts";

Cypress.Commands.add("loginAsStandard", (next = "/account.html") => {
  cy.visit(`/login.html?next=${encodeURIComponent(next)}`);
  cy.get('[data-testid="login-email"]').type(accounts.standard.email);
  cy.get('[data-testid="login-password"]').type(accounts.standard.password, { log: false });
  cy.get('[data-testid="login-submit"]').click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsStandard(next?: string): Chainable<void>;
    }
  }
}

export {};
