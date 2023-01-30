describe("input form", () => {
  beforeEach(() => {
    cy.seedAndVisit([]);
  });
  it("focuces input on load", () => {
    cy.focused().should("have.class", "new-todo");
  });
  it("accepts input", () => {
    const typedText = "Buy Milk";
    cy.get(".new-todo").type(typedText).should("have.value", typedText);
  });
  context("form submission", () => {
    beforeEach(() => {
      cy.server();
    });
    it("adds a new todo on submit", () => {
      const inputText = "buy eggs";
      cy.route("POST", "/api/todos", {
        name: inputText,
        id: 1,
        isComplete: false,
      });
      cy.get(".new-todo")
        .type(inputText)
        .type("{enter}")
        .should("have.value", "");
      cy.get(".todo-list li")
        .should("have.length", 1)
        .and("contain", inputText);
    });
    it("Show an error message on a failed submission", () => {
      cy.route({
        url: "/api/todos",
        method: "POST",
        status: 500,
        response: {},
      });
      cy.get(".new-todo").type("test{enter}");
      cy.get(".todo-list li").should("not.exist");

      cy.get(".error").should("be.visible");
    });
  });
});
