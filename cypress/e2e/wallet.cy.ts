describe("MetaMask wallet flow (mocked provider)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows connect button and mock-connects", () => {
    cy.connectWallet();
    cy.get("button").contains(/0x742d/i).should("be.visible");
  });

  it("opens cases as connected user with moderator role", () => {
    cy.visit("/cases");
    cy.window().then((win) => {
      win.localStorage.setItem("evidence-desk:role", "moderator");
    });
    cy.reload();
    cy.connectWallet();
    cy.contains(/Open case wizard|Майстер/i).should("be.visible");
  });

  it("shows cross_check tooltip target on cases list when data exists", () => {
    cy.visit("/cases");
    cy.get("body").then(($body) => {
      if ($body.text().includes("cross_check")) {
        cy.contains("cross_check").first().should("be.visible");
      }
    });
  });
});
