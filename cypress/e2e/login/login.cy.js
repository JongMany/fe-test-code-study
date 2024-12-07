describe("로그인 화면", () => {
  it("사용자는 아이디와 비밀번호를 사용해서 로그인한다.", () => {
    // Given - 로그인 화면이 그려진다.
    cy.visit("/login");
    cy.get("[data-cy=emailInput]").as("emailInput");
    cy.get("[data-cy=passwordInput]").as("passwordInput");

    // When - 아이디와 비밀번호를 입력하고 로그인 버튼을 클릭한다.
    cy.get("@emailInput").type("test@example.com");
    cy.get("@passwordInput").type("password123");

    cy.get("@emailInput").invoke("val").should("eq", "test@example.com");
    cy.get("@passwordInput").invoke("val").should("eq", "password123");

    cy.get("[data-cy=loginButton]").should("exist").click();
    // Then - 로그인에 성공한다. 메인화면 으로 이동한다.
    cy.url().should("include", "http://localhost:5173/");
  });
});
