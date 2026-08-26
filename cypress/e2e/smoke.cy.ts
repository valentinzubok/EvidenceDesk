describe("Evidence Desk smoke", () => {
  it("loads home with header, footer, and favicon", () => {
    cy.visit("/");
    cy.contains("Evidence Desk").should("be.visible");
    cy.get("header.site-header").should("be.visible");
    cy.get("footer.site-footer").should("be.visible");
    cy.get('link[rel="icon"]').should("exist");
  });

  it("loads home and navigates to cases & criteria", () => {
    cy.visit("/");
    cy.contains("Evidence Desk").should("be.visible");
    cy.contains(/Cases|Кейси/i).click();
    cy.url().should("include", "/cases");
    cy.contains(/On-chain|ланцюгу/i).should("be.visible");
    cy.contains(/Criteria|Критерії/i).click();
    cy.url().should("include", "/criteria");
  });

  it("loads marketplace", () => {
    cy.visit("/marketplace");
    cy.contains(/Marketplace|критеріїв/i).should("be.visible");
  });

  it("calls GraphQL summary", () => {
    cy.request({
      method: "POST",
      url: "/api/graphql",
      body: { query: "{ summary { total clean tampered } }" },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.data.summary).to.have.property("total");
    });
  });
});
