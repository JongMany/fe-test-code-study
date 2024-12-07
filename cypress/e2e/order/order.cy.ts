describe("", () => {
  it("", () => {
    cy.visit("/");

    cy.get("[data-cy=deliveryBtn]").should("be.visible").as("deliveryBtn");
    cy.get("[data-cy=pickupBtn]").should("be.visible").as("pickupBtn");

    cy.get("@deliveryBtn").click();
    cy.url().should("include", "/food-type");
  });
});
