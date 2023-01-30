/// <reference types="cypress" />

Cypress.Commands.add("seedAndVisit", (seedData: any = "fixture:todos") => {
  cy.server();
  cy.route("GET", "/api/todos", seedData);
  cy.visit("/");
});

export {};
