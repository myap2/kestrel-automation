import { LoginPage } from "../support/pages/LoginPage";
import { accounts } from "../support/accounts";

describe("Login", () => {
  const login = new LoginPage();

  it("signs in with a standard account", () => {
    login.visit();
    login.signIn(accounts.standard.email, accounts.standard.password);
    cy.get('[data-testid="account-name"]').should("have.text", accounts.standard.name);
    cy.get('[data-testid="account-email"]').should("have.text", accounts.standard.email);
  });

  it("rejects a bad password", () => {
    login.visit();
    login.signIn(accounts.invalid.email, accounts.invalid.password);
    login.flash().should("be.visible").and("contain.text", "Email or password is incorrect.");
    cy.location("pathname").should("include", "login.html");
  });

  it("blocks a locked account", () => {
    login.visit();
    login.signIn(accounts.locked.email, accounts.locked.password);
    login.flash().should("contain.text", "account is locked");
  });
});
