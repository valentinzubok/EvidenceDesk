/// <reference types="cypress" />

Cypress.Commands.add("connectWallet", () => {
  cy.contains("button", /Connect Wallet|Підключити/i).click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      connectWallet(): Chainable<void>;
    }
  }
}

export {};
