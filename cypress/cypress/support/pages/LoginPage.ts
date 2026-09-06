export class LoginPage {
  visit(next?: string) {
    cy.visit(next ? `/login.html?next=${encodeURIComponent(next)}` : "/login.html");
  }

  signIn(email: string, password: string) {
    cy.get('[data-testid="login-email"]').clear().type(email);
    cy.get('[data-testid="login-password"]').clear().type(password, { log: false });
    cy.get('[data-testid="login-submit"]').click();
  }

  flash() {
    return cy.get('[data-testid="flash"]');
  }
}
