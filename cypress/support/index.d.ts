/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    seedAndVisit(): Chainable<null>;
  }
}


